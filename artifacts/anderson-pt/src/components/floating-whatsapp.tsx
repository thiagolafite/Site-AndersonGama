import { Link } from "wouter";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const phoneNumber = "5571878411755";
  const message = encodeURIComponent("Olá Anderson! Gostaria de saber mais sobre a consultoria.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={32} className="fill-current" />
    </a>
  );
}
