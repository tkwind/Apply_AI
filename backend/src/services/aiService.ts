import { OpenAI } from 'openai';
import { NIM_API_KEY, NIM_API_URL, NIM_MODEL } from '../utils/config';

const client = new OpenAI({
  baseURL: NIM_API_URL,
  apiKey: NIM_API_KEY,
});

export type ParsedJob = {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
};

export const parseJobDescription = async (jobDescription: string): Promise<ParsedJob> => {
  const prompt = `Extract the following fields from the job description below and return only valid JSON with keys: company, role, requiredSkills, niceToHave, seniority, location. If any value is missing, return an empty string or empty array.\n\nJob description:\n\n${jobDescription}`;

  console.log('Calling NIM API with model:', NIM_MODEL, 'URL:', NIM_API_URL);

  try {
    const response = await client.chat.completions.create({
      model: NIM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false, // Try without streaming first
    });

    const text = response.choices[0]?.message?.content || '';
    console.log('Raw AI response:', text);

    const parsed = JSON.parse(text);
    return {
      company: parsed.company || '',
      role: parsed.role || '',
      requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
      niceToHave: Array.isArray(parsed.niceToHave) ? parsed.niceToHave : [],
      seniority: parsed.seniority || '',
      location: parsed.location || '',
    };
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('AI parsing failed. Please check your NVIDIA NIM configuration.');
  }
};

export const generateResumeSuggestions = async (jobDescription: string): Promise<string[]> => {
  const prompt = `Read the job description below and generate 4 tailored resume bullet points that highlight a candidate's fit for the role. Return a JSON array of strings only.\n\nJob description:\n\n${jobDescription}`;

  try {
    const response = await client.chat.completions.create({
      model: NIM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    const text = response.choices[0]?.message?.content || '';
    const suggestions = JSON.parse(text);
    if (!Array.isArray(suggestions)) {
      throw new Error('Resume suggestions expected as array');
    }
    return suggestions.map((item: unknown) => String(item));
  } catch (error) {
    console.error('Resume suggestions AI service error:', error);
    throw new Error('Failed to generate resume suggestions. Please check your NVIDIA NIM configuration.');
  }
};
