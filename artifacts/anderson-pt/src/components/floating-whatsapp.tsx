import { FaWhatsapp } from "react-icons/fa6";

export default function FloatingWhatsApp() {
  const phoneNumber = "557187841755";
  const message = encodeURIComponent("Olá Anderson! Gostaria de saber mais sobre a consultoria.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      aria-label="Falar no WhatsApp"
    >
      <FaWhatsapp size={34} />
    </a>
  );
}
