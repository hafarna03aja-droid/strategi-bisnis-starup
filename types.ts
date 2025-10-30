export interface BusinessInput {
  name: string;
  description: string;
  targetAudience: string;
  competitors: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        text: string;
        author: string;
      }[];
    }[];
  };
}

export interface ExecutiveSummary {
  swot: string;
  targetAudience: string;
  marketTrends: string;
  marketingStrategy: string;
  localOpportunities?: string;
}

export interface AnalysisResult {
  swotAnalysis: string;
  targetAudienceProfile: string;
  marketTrends: string;
  marketingStrategy: string;
  localOpportunities?: string;
  marketTrendsSources?: GroundingChunk[];
  localOpportunitiesSources?: GroundingChunk[];
  executiveSummary: ExecutiveSummary;
  suggestedQuestions?: string[];
}

export interface Geolocation {
  latitude: number;
  longitude: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}