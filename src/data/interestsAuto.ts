// Auto-generated file - DO NOT EDIT
export interface InterestImage {
  filename: string
  url: string
  city: string
  spot: string
  date: string
}

export interface InterestData {
  title: string
  cover: string
  intro: string
  content: string
  images: InterestImage[]
}

export const interestsData: Record<string, InterestData> = {}
