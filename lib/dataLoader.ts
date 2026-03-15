import { HanziItem } from '@/lib/types'

let globalDataCache: HanziItem[] | null = null

const transformKeys = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(transformKeys)

  const transformed: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      transformed[camelKey] = transformKeys(obj[key])
    }
  }
  return transformed
}

export const loadHanziData = async (): Promise<HanziItem[]> => {
  if (globalDataCache) {
    return globalDataCache
  }

  try {
    const [data1, data2] = await Promise.all([
      fetch('/data/data1.json').then(response => response.json()),
      fetch('/data/data2.json').then(response => response.json())
    ])

    const combinedData = [...data1, ...data2]
    const transformedData = combinedData.map(transformKeys)
    globalDataCache = transformedData as HanziItem[]

    return globalDataCache
  } catch (error) {
    console.error('Error loading data:', error)
    return []
  }
}

export const clearDataCache = () => {
  globalDataCache = null
}
