// Badge da bandeira do Brasil — o ícone que acompanha "Oficina de Artesanato
// Sustentável" em todo material do manual de marca (cartão, tag, tote bag,
// parede). Cores fixas (não segue token de marca — é a bandeira, não a
// paleta Moikato).
export default function BandeiraBR({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 16"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect x="0.5" y="0.5" width="23" height="15" rx="2" fill="#009739" stroke="#00602a" strokeWidth="0.5" />
      <path d="M12 2.2 21.5 8 12 13.8 2.5 8Z" fill="#FEDD00" />
      <circle cx="12" cy="8" r="3.6" fill="#012169" />
      <path d="M8.6 6.6c2 1.4 4.8 1.4 6.8 0" stroke="#fff" strokeWidth="0.6" fill="none" />
    </svg>
  );
}
