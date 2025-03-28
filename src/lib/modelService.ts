import { toast } from "@/hooks/use-toast";

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  parameters: string;
  provider: string;
  modelId: string;
}

export const availableModels: ModelInfo[] = [
  {
    id: "meta-llama3-8b",
    name: "Llama 3 8B",
    description: "Meta's Llama 3 8B model - fast and efficient",
    parameters: "8B",
    provider: "Meta",
    modelId: "meta-llama/Llama-3-8B-hf"
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    description: "Mistral 7B Instruct - good quality text generation",
    parameters: "7B",
    provider: "Mistral AI",
    modelId: "mistralai/Mistral-7B-Instruct-v0.2"
  },
  {
    id: "gemma-2b",
    name: "Gemma 2B",
    description: "Google's Gemma 2B - lightweight model",
    parameters: "2B",
    provider: "Google",
    modelId: "google/gemma-2b"
  }
];

let loadedModelId: string | null = null;

export async function loadModel(modelInfo: ModelInfo, onProgress?: (progress: number) => void): Promise<void> {
  try {
    // If model is already loaded, just return
    if (loadedModelId === modelInfo.id) {
      return;
    }

    let progress = 0;
    onProgress?.(progress);

    // Simulate loading with realistic progress updates
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        // Increment progress in a realistic way (faster at first, slower towards the end)
        const increment = 0.1 * (1 - progress * 0.5); 
        progress += increment;
        
        // Cap progress at 100%
        if (progress >= 1) {
          progress = 1;
          clearInterval(interval);
          
          // Set the loaded model ID
          loadedModelId = modelInfo.id;
          
          // Show success message
          toast({
            title: "Model Loaded",
            description: `${modelInfo.name} loaded successfully`,
          });
          
          resolve();
        }
        
        onProgress?.(progress);
      }, 300); // Update progress every 300ms
    });
  } catch (error) {
    console.error("Error loading model:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: `Failed to load model: ${(error as Error).message}`,
    });
    throw error;
  }
}

export async function generateResponse(prompt: string): Promise<string> {
  try {
    // Simulate response generation with more dynamic responses
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedPrompt = prompt.toLowerCase().trim();
        
        // Define topic detection patterns
        const topics = {
          greeting: /\b(hi|hello|hey|greetings)\b/i,
          weather: /\b(weather|temperature|forecast|rain|sunny|cloudy)\b/i,
          help: /\b(help|assist|support)\b/i,
          movies: /\b(movie|film|cinema|watch|actor|actress|director)\b/i,
          music: /\b(music|song|artist|band|album|concert)\b/i,
          food: /\b(food|eat|cooking|recipe|restaurant|dish|meal)\b/i,
          programming: /\b(code|programming|javascript|python|developer|software)\b/i,
          science: /\b(science|physics|chemistry|biology|scientific)\b/i,
          sports: /\b(sport|football|soccer|basketball|baseball|tennis|game)\b/i,
          technology: /\b(technology|tech|computer|phone|device|gadget)\b/i,
          health: /\b(health|medical|doctor|exercise|fitness)\b/i,
          travel: /\b(travel|trip|vacation|flight|hotel|destination|country|city)\b/i,
          book: /\b(book|reading|author|novel|story)\b/i,
        };
        
        // Model-specific response templates with more variation
        const templates: Record<string, Record<string, string[]>> = {
          "meta-llama3-8b": {
            default: [
              "As Llama 3, I can provide information on a wide range of topics while running locally on your device. %CONTENT%",
              "I'm processing your query about %TOPIC% locally using Meta's Llama 3 model. %CONTENT%",
              "Thanks for asking about %TOPIC%. As a locally-running Llama 3 model, I can help with that. %CONTENT%"
            ],
            greeting: [
              "Hello there! I'm Llama 3, a language model running locally on your device. How can I assist you today?",
              "Hi! I'm Meta's Llama 3 model, operating directly on your machine for privacy. What can I help you with?",
              "Greetings! I'm Llama 3 by Meta, running locally for private conversations. How may I help you?"
            ],
            weather: [
              "While I don't have access to real-time weather data, I can explain how weather forecasting works or discuss climate patterns in general.",
              "I don't have access to current weather information since I run locally and don't have internet access. To check the weather, you might want to use a weather app or website.",
              "Since I'm running locally on your device without internet access, I can't provide current weather information. For that, you would need a service with real-time data access."
            ],
            // Add more topic-specific responses for Llama 3
          },
          "mistral-7b": {
            default: [
              "I'm processing your question about %TOPIC% using Mistral's 7B parameter model, running locally for privacy. %CONTENT%",
              "As Mistral 7B running on your device, I can provide insights about %TOPIC%. %CONTENT%",
              "Your question about %TOPIC% is interesting. As a locally-running Mistral 7B model, here's what I can tell you: %CONTENT%"
            ],
            greeting: [
              "Hello! I'm Mistral 7B, a language model running locally on your device. How can I help you today?",
              "Hi there! I'm the Mistral 7B model, operating right here on your machine for privacy. What would you like assistance with?",
              "Greetings! I'm Mistral 7B, ready to assist while keeping your data private by running locally. How can I help?"
            ],
            // Add more topic-specific responses for Mistral
          },
          "gemma-2b": {
            default: [
              "As Google's Gemma 2B model running locally, I can provide information about %TOPIC%. %CONTENT%",
              "I'm analyzing your question about %TOPIC% using Google's Gemma 2B model, which runs entirely on your device. %CONTENT%",
              "Your inquiry about %TOPIC% is interesting. As a locally-running Gemma 2B model, here's what I know: %CONTENT%"
            ],
            greeting: [
              "Hello! I'm Gemma 2B, Google's language model running locally on your device. How can I assist you today?",
              "Hi there! I'm Google's Gemma 2B model, operating directly on your machine for privacy. What can I help you with?",
              "Greetings! I'm Gemma, a lightweight model from Google running locally. How may I assist you today?"
            ],
            // Add more topic-specific responses for Gemma
          }
        };

        // Generic responses to use for any model if no specific template is found
        const genericResponses: Record<string, string[]> = {
          default: [
            "I'm processing your query about %TOPIC% locally for privacy. %CONTENT%",
            "Thanks for asking about %TOPIC%. Here's what I can tell you: %CONTENT%",
            "Your question about %TOPIC% is interesting. As a locally-running model, here's my response: %CONTENT%"
          ],
          greeting: [
            "Hello! I'm a language model running locally on your device. How can I help you today?",
            "Hi there! I'm a language model operating directly on your machine for privacy. What can I help you with?",
            "Greetings! I'm a language model running locally. How may I assist you today?"
          ],
          // Add more generic topic responses
        };

        // Detect topic from prompt
        let detectedTopic = "default";
        for (const [topic, pattern] of Object.entries(topics)) {
          if (pattern.test(normalizedPrompt)) {
            detectedTopic = topic;
            break;
          }
        }

        // Generate content based on topic
        const generateTopicContent = () => {
          const topicContents: Record<string, string[]> = {
            default: [
              "I can provide information on a wide range of topics while maintaining your privacy.",
              "I'm designed to be helpful while keeping your data secure by processing everything locally.",
              "Let me know if you need more specific information on this or another topic."
            ],
            weather: [
              "Weather forecasting combines atmospheric science, data collection, and predictive modeling to estimate future conditions.",
              "Climate patterns are influenced by factors like ocean currents, atmospheric pressure systems, and seasonal variations.",
              "Local microclimates can significantly differ from regional weather due to factors like elevation, water bodies, and urban development."
            ],
            help: [
              "I'm here to assist with information, answer questions, or engage in conversation on various topics.",
              "I can explain concepts, provide summaries, or discuss ideas across many subjects, all while running on your local device.",
              "Feel free to ask about specific topics, and I'll do my best to provide helpful information."
            ],
            movies: [
              "Film is a visual art form that tells stories through sequences of moving images, sound, and dialogue.",
              "Cinema has evolved tremendously since its inception, from silent films to today's digital productions with advanced visual effects.",
              "Different film genres like drama, comedy, science fiction, and documentary offer unique storytelling approaches and experiences."
            ],
            music: [
              "Music is organized sound that combines elements like rhythm, melody, harmony, and timbre into artistic expressions.",
              "Musical traditions vary greatly across cultures, each with unique instruments, scales, and performance practices.",
              "Technology has transformed music production, distribution, and consumption throughout history, from phonographs to streaming services."
            ],
            programming: [
              "Programming languages are formal languages that specify a set of instructions for computers to execute specific tasks.",
              "Software development involves designing, coding, testing, and maintaining applications that solve real-world problems.",
              "Computer science principles like algorithms, data structures, and computational complexity underpin modern programming."
            ],
            science: [
              "The scientific method provides a systematic approach to understanding the natural world through observation, hypothesis formation, and experimentation.",
              "Various scientific disciplines examine different aspects of reality, from the smallest subatomic particles to the vastness of the cosmos.",
              "Scientific discoveries have revolutionized our understanding of the universe and led to countless technological innovations."
            ],
            sports: [
              "Sports combine physical activity, skill development, and competition, often within structured rule systems.",
              "Athletic events have cultural significance worldwide, bringing people together through shared experiences and traditions.",
              "The science of sports performance examines biomechanics, nutrition, psychology, and training methodologies to optimize athletic achievement."
            ],
            technology: [
              "Technological innovation involves developing new tools, systems, and methods to solve problems and extend human capabilities.",
              "Digital technologies have transformed how we communicate, work, learn, and entertain ourselves in the modern world.",
              "Emerging technologies like artificial intelligence, biotechnology, and quantum computing promise to reshape society in profound ways."
            ],
            health: [
              "Health involves physical, mental, and social well-being, not merely the absence of disease or infirmity.",
              "Preventive healthcare focuses on lifestyle factors, regular screenings, and early interventions to maintain wellness.",
              "Medical science continues to advance our understanding of human biology and develop new treatments for various conditions."
            ],
            travel: [
              "Travel broadens perspectives by exposing people to different cultures, environments, and ways of living.",
              "Tourism encompasses various experiences, from relaxation and adventure to cultural immersion and educational exploration.",
              "Transportation systems have evolved dramatically, making previously remote destinations accessible to more people."
            ],
            book: [
              "Literature offers insights into human experiences, emotions, and societies across time and cultures.",
              "Reading engages the imagination, builds vocabulary, and develops critical thinking skills.",
              "Different literary genres provide unique frameworks for storytelling, from poetry and drama to novels and non-fiction."
            ]
          };

          const contentArray = topicContents[detectedTopic] || topicContents.default;
          return contentArray[Math.floor(Math.random() * contentArray.length)];
        };

        // Determine which model is being used for response
        const modelResponses = loadedModelId && templates[loadedModelId] 
          ? templates[loadedModelId] 
          : genericResponses;
        
        // Get response templates for the detected topic or fall back to default
        const topicTemplates = modelResponses[detectedTopic] || modelResponses.default;
        
        // Select a random template from the available options
        const template = topicTemplates[Math.floor(Math.random() * topicTemplates.length)];
        
        // Generate the content for the response
        const content = generateTopicContent();
        
        // Replace placeholders in the template
        let response = template
          .replace(/%TOPIC%/g, detectedTopic === "default" ? "this topic" : detectedTopic)
          .replace(/%CONTENT%/g, content);
        
        // Add more variation based on prompt complexity
        if (prompt.length > 50) {
          const complexityAdditions = [
            " I notice your question is quite detailed. ",
            " That's a thoughtful query. ",
            " Your question has multiple interesting aspects. "
          ];
          const randomAddition = complexityAdditions[Math.floor(Math.random() * complexityAdditions.length)];
          
          // Insert the addition at a sensible point in the response
          const insertPoint = response.indexOf(". ") + 2;
          if (insertPoint > 1) {
            response = response.slice(0, insertPoint) + randomAddition + response.slice(insertPoint);
          }
        }
        
        resolve(response);
      }, 1500); // Simulate thinking time (1.5 seconds)
    });
  } catch (error) {
    console.error("Error generating response:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to generate response"
    });
    throw error;
  }
}
