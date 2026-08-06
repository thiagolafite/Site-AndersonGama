import { useState, useRef, useEffect } from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import { User, MessageSquareText, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FloatingWhatsApp() {
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const instagramRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const phoneNumber = "557187841755";
  const whatsappMessage = encodeURIComponent("Olá Anderson! Gostaria de saber mais sobre a consultoria.");

  const instagramProfileUrl = "https://www.instagram.com/andersongama_personal/";
  const instagramDirectUrl = "https://www.instagram.com/direct/t/102818864566526/";
  const autoMessage = "Olá anderson,tenho interesse em saber mais sobre a consultoria";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (instagramRef.current && !instagramRef.current.contains(event.target as Node)) {
        setIsInstagramOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendDirect = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsInstagramOpen(false);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(autoMessage).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }

    toast({
      title: "Mensagem Copiada!",
      description: "A mensagem foi copiada para sua área de transferência. Cole no Direct!",
    });

    window.open(instagramDirectUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Instagram Options Popover */}
      {isInstagramOpen && (
        <div 
          ref={instagramRef}
          className="mb-1 w-72 rounded-2xl bg-card/95 border border-border p-4 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <FaInstagram className="text-[#E4405F]" size={18} />
              <span>Instagram</span>
            </div>
            <button 
              onClick={() => setIsInstagramOpen(false)}
              className="text-muted-foreground hover:text-white p-1 rounded-full hover:bg-secondary/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={instagramDirectUrl}
              onClick={handleSendDirect}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-gradient-to-r from-[#dc2743]/10 to-[#bc1888]/10 border border-[#dc2743]/30 text-white text-sm font-medium hover:from-[#dc2743]/20 hover:to-[#bc1888]/20 hover:border-[#dc2743]/60 transition-all duration-200"
            >
              {copied ? (
                <Check size={18} className="text-green-400 shrink-0" />
              ) : (
                <MessageSquareText size={18} className="text-[#dc2743] shrink-0" />
              )}
              <div className="flex flex-col text-left">
                <span className="font-semibold text-xs leading-tight">Enviar Mensagem Direct</span>
                <span className="text-[10px] text-muted-foreground line-clamp-1">
                  "{autoMessage}"
                </span>
              </div>
            </a>

            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsInstagramOpen(false)}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-secondary/40 border border-border/40 text-white text-sm font-medium hover:bg-secondary/80 hover:border-border transition-all duration-200"
            >
              <User size={18} className="text-primary shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-xs leading-tight">Ver Perfil Oficial</span>
                <span className="text-[10px] text-muted-foreground">@andersongama_personal</span>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Instagram Button */}
        <button
          onClick={() => setIsInstagramOpen(!isInstagramOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          aria-label="Opções do Instagram"
        >
          <FaInstagram size={32} />
          <span className="absolute right-16 bg-card/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md border border-border">
            Instagram
          </span>
        </button>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          aria-label="Falar no WhatsApp"
        >
          <FaWhatsapp size={34} />
          <span className="absolute right-16 bg-card/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md border border-border">
            WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
