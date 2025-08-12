import { searchWLO, normalizeWLONode } from './wloApi';
import { extractLearningMetadata, generateChatResponse } from './llmApi';
import { ChatMessage, ChatSettings, WLOMetadata, ChatResponse } from './types';
import { FACH_MAPPING, INHALTSTYP_MAPPING } from './mappings';

// Function to extract which WLO materials were actually used in the chat response
function extractUsedWLOMaterials(chatResponse: string, allWloSuggestions: WLOMetadata[]): WLOMetadata[] {
  if (!chatResponse || !allWloSuggestions.length) return [];
  
  const usedMaterials: WLOMetadata[] = [];
  
  // Check for material references like "Material 1", "Material 2", etc.
  const materialReferences = chatResponse.match(/\[Material \d+\]/g) || [];
  materialReferences.forEach(ref => {
    const materialNumber = parseInt(ref.match(/\d+/)?.[0] || '0');
    if (materialNumber > 0 && materialNumber <= allWloSuggestions.length) {
      const material = allWloSuggestions[materialNumber - 1];
      if (material && !usedMaterials.find(m => m.refId === material.refId)) {
        usedMaterials.push(material);
      }
    }
  });
  
  // Check for direct title references in square brackets
  allWloSuggestions.forEach(material => {
    if (material.title) {
      const titlePattern = new RegExp(`\\[${material.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'i');
      if (titlePattern.test(chatResponse)) {
        if (!usedMaterials.find(m => m.refId === material.refId)) {
          usedMaterials.push(material);
        }
      }
    }
  });
  
  // Check for materials referenced in HTML links within the response
  const htmlLinkPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let linkMatch;
  while ((linkMatch = htmlLinkPattern.exec(chatResponse)) !== null) {
    const linkUrl = linkMatch[1];
    const linkText = linkMatch[2];
    
    // Find material by URL or title
    const material = allWloSuggestions.find(m => 
      (m.wwwUrl && linkUrl.includes(m.wwwUrl)) ||
      (m.url && linkUrl.includes(m.url)) ||
      (m.refId && linkUrl.includes(m.refId)) ||
      (m.title && linkText.includes(m.title))
    );
    
    if (material && !usedMaterials.find(m => m.refId === material.refId)) {
      usedMaterials.push(material);
    }
  }
  
  return usedMaterials;
}

export async function getWLOSuggestions(
  userText: string, 
  settings: ChatSettings,
  previousBotMessage?: string
): Promise<WLOMetadata[]> {
  if (!settings.enableWLO) return [];

  try {
    // Combine user input with previous bot message for better context
    let contextText = userText;
    if (previousBotMessage) {
      // Remove HTML tags and WLO recommendations from previous message
      const cleanBotMessage = previousBotMessage
        .replace(/<hr>[\s\S]*?<\/ul>/g, '') // Remove WLO HTML block
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .trim();
      
      if (cleanBotMessage) {
        contextText = `${cleanBotMessage} ${userText}`;
      }
    }
    
    // Extract metadata from combined context
    const metadata = await extractLearningMetadata(contextText, settings);
    
    // Build search parameters
    const properties = ['cclom:title'];
    const values = [metadata.topic || userText];
    
    // Also search in description for better context matching
    if (previousBotMessage && metadata.topic) {
      properties.push('cclom:general_description');
      values.push(metadata.topic);
    }
    
    // Add subject filter if recognized
    if (metadata.subject && metadata.subject in FACH_MAPPING) {
      properties.push('ccm:taxonid');
      values.push(FACH_MAPPING[metadata.subject as keyof typeof FACH_MAPPING]);
    }
    
    // Add content type filter if recognized
    if (metadata.content_type && metadata.content_type in INHALTSTYP_MAPPING) {
      properties.push('ccm:oeh_lrt_aggregated');
      values.push(INHALTSTYP_MAPPING[metadata.content_type as keyof typeof INHALTSTYP_MAPPING]);
    }

    // Search WLO API
    const response = await searchWLO({
      properties,
      values,
      maxItems: 10 // Always fetch 10 items for AI to choose from
    });

    // Normalize and filter results
    const suggestions = response.nodes
      .map(normalizeWLONode)
      .filter(item => item.wwwUrl) // Only include items with valid URLs
      .slice(0, 10);

    return suggestions;
  } catch (error) {
    console.error('WLO suggestions failed:', error);
    return [];
  }
}

export async function processChatMessage(
  messages: ChatMessage[],
  newMessage: string,
  settings: ChatSettings
): Promise<ChatResponse> {
  try {
    // Find the last bot message for context
    const lastBotMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'assistant')?.content;
    
    // Get WLO suggestions with context from previous bot message
    const wloSuggestions = await getWLOSuggestions(newMessage, settings, lastBotMessage);
    
    // Add the new user message
    const updatedMessages = [
      ...messages,
      { role: 'user' as const, content: newMessage, timestamp: Date.now() }
    ];

    // Generate chat response with WLO context
    const response = await generateChatResponse(updatedMessages, wloSuggestions, settings);
    
    // Filter WLO suggestions to only include materials actually used in the response
    const usedWloMaterials = extractUsedWLOMaterials(response.message, wloSuggestions);
    
    // Add debug metadata if enabled
    if (settings.debugMode && response.debugInfo) {
      const metadata = await extractLearningMetadata(newMessage, settings);
      response.debugInfo.metadata = metadata;
      response.debugInfo.wloSamples = wloSuggestions.slice(0, 3).map(s => ({
        title: s.title || 'Unbekannt',
        wwwUrl: s.wwwUrl || undefined,
        url: (s as any).url || undefined,
        refId: s.refId || '',
        finalUrl: s.wwwUrl || (s as any).url || (s.refId ? `https://redaktion.openeduhub.net/edu-sharing/components/render/${s.refId}` : null)
      }));
      response.debugInfo.wloCount = usedWloMaterials.length;
    }

    // Return response with filtered WLO suggestions (only materials actually used)
    return {
      ...response,
      wloSuggestions: usedWloMaterials
    };
  } catch (error) {
    console.error('Chat processing failed:', error);
    
    // Re-throw the error instead of providing fallback response
    throw error;
  }
}

export function formatDebugInfo(debugInfo: any): string {
  return JSON.stringify({
    model: debugInfo.model,
    metadata: debugInfo.metadata,
    wloCount: debugInfo.wloCount,
    timestamp: new Date().toISOString()
  }, null, 2);
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}


