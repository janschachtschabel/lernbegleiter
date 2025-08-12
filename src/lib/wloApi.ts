import axios from 'axios';
import { WLOSearchParams, WLOMetadata } from './types';

export async function searchWLO({
  properties,
  values,
  maxItems = 10,
  skipCount = 0,
  propertyFilter = '-all-',
  combineMode: _combineMode = 'OR'
}: WLOSearchParams): Promise<{ nodes: any[] }> {
  try {
    // Construct the search criteria array
    const criteria = [];
    
    // Add title/search word as first criterion
    if (properties.includes('cclom:title') && values[0]) {
      criteria.push({
        property: 'ngsearchword',
        values: [values[0]]
      });
    }

    // Map old property names to new ones
    const propertyMapping: Record<string, string> = {
      'ccm:oeh_lrt_aggregated': 'ccm:oeh_lrt_aggregated',
      'ccm:taxonid': 'virtual:taxonid',
      'ccm:educationalcontext': 'ccm:educationalcontext'
    };

    // Add remaining criteria with mapped properties
    for (let i = 0; i < properties.length; i++) {
      if (properties[i] !== 'cclom:title' && values[i]) {
        criteria.push({
          property: propertyMapping[properties[i]] || properties[i],
          values: [values[i]]
        });
      }
    }

    const searchParams = new URLSearchParams({
      contentType: 'FILES',
      maxItems: maxItems.toString(),
      skipCount: skipCount.toString(),
      propertyFilter
    });

    const url = `/api/edu-sharing/rest/search/v1/queries/-home-/mds_oeh/ngsearch?${searchParams}`;

    const response = await axios.post(
      url,
      { criteria },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`WLO API request failed: ${error.message} (${error.response?.status} ${error.response?.statusText})`);
    } else {
      throw new Error('WLO API request failed: Unknown error occurred');
    }
  }
}

export function normalizeWLONode(node: any): WLOMetadata {
  return {
    title: node.properties['cclom:title']?.[0] || 
           node.properties['cm:title']?.[0] ||
           node.properties['cm:name']?.[0] ||
           'Untitled Resource',
    collectionId: node.properties['ccm:collectionid']?.[0] || '',
    hierarchyLevel: node.properties['ccm:hierarchyLevel']?.[0] || 1,
    parentPath: node.properties['ccm:parentPath']?.[0] || '',
    parentId: node.properties['ccm:parentId']?.[0] || '',
    refId: node.ref?.id || '',
    keywords: node.properties['cclom:general_keyword'] || [],
    description: node.properties['cclom:general_description']?.[0] || 
                node.properties['cm:description']?.[0] || '',
    subject: node.properties['ccm:taxonid_DISPLAYNAME']?.[0] || '',
    educationalContext: node.properties['ccm:educationalcontext_DISPLAYNAME'] || [],
    wwwUrl: node.properties['cclom:location']?.[0] || 
            node.properties['ccm:wwwurl']?.[0] || 
            (node.ref?.id ? `https://redaktion.openeduhub.net/edu-sharing/components/render/${node.ref.id}` : null),
    previewUrl: node.ref?.id ? `https://redaktion.openeduhub.net/edu-sharing/preview?nodeId=${node.ref.id}&storeProtocol=workspace&storeId=SpacesStore` : null,
    resourceType: node.properties['ccm:oeh_lrt_aggregated_DISPLAYNAME']?.[0] || 
                 node.properties['ccm:resourcetype_DISPLAYNAME']?.[0] || 
                 node.properties['ccm:oeh_lrt_aggregated']?.[0]?.split('/').pop() || 
                 'Lernressource'
  };
}
