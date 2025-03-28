import React, { useState } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Model {
  id: string;
  name: string;
  description: string;
  parameters: string;
  provider: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: Model;
  onSelectModel: (model: Model) => void;
  isLoading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "flex items-center space-x-2 neo-blur px-4 py-2 rounded-lg text-sm text-white/80 transition-all",
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:text-white hover:bg-white/5"
        )}
      >
        <Sparkles size={16} className="text-primary" />
        <span>{selectedModel.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute mt-2 w-64 glass-morphism rounded-lg overflow-hidden z-10 animate-fade-in">
          <div className="py-1 max-h-80 overflow-y-auto scrollbar-thin">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onSelectModel(model);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors",
                  selectedModel.id === model.id ? "bg-primary/10" : ""
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-white">{model.name}</span>
                    {selectedModel.id === model.id && (
                      <Check size={16} className="ml-2 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-white/60 mt-1">{model.description}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                      {model.parameters}
                    </span>
                    <span className="text-xs text-white/50">{model.provider}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
