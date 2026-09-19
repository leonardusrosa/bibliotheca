import React, { useState } from "react";
import { BookCardViewModel } from "@/types/bibliotheca";
import { BookCard } from "./BookCard";
import { useAuth } from "@/hooks/useAuth";
import { BibliothecaAuthDialog } from "./BibliothecaAuthDialog";
import { Cloud, Plus } from "lucide-react";

interface BookGridProps {
  books: BookCardViewModel[];
  emptyMessage?: string;
  onAddClick?: () => void;
}

export function BookGrid({
  books,
  emptyMessage = "Nenhum livro cadastrado nesta seção.",
  onAddClick,
}: BookGridProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (books.length === 0) {
    return (
      <>
        <div className="py-16 px-4 text-center rounded-xl bg-[var(--stone-gray-alpha)]/20 border border-[var(--ancient-gold-alpha-soft)] flex flex-col items-center justify-center gap-4">
          <p className="font-cormorant text-lg italic text-[var(--sacred-ivory)]/70 max-w-sm">
            {emptyMessage}
          </p>

          {!user && (
            <p className="font-inter text-xs text-[var(--sacred-ivory)]/50 max-w-md">
              Você está no modo local (dispositivo). Se já cadastrou seus livros no acervo em nuvem, entre na sua conta para sincronizá-los.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="py-2.5 px-4 rounded-lg bg-[var(--ancient-gold)] hover:bg-[var(--gold-leaf)] text-black text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Entrar no Acervo em Nuvem</span>
              </button>
            )}

            {onAddClick && (
              <button
                onClick={onAddClick}
                className={`py-2.5 px-4 rounded-lg text-xs font-medium transition-colors ${
                  !user
                    ? "bg-white/5 hover:bg-white/10 text-[var(--parchment)] border border-white/10"
                    : "bg-[var(--ancient-gold)] hover:bg-[var(--gold-leaf)] text-black shadow-sm"
                } flex items-center gap-1.5`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Livro</span>
              </button>
            )}
          </div>
        </div>

        <BibliothecaAuthDialog
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    );
  }

  return (
    <div
      aria-label="Grade de livros da biblioteca"
      className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,210px))] gap-4 sm:gap-5 md:gap-6 justify-start items-start"
    >
      {books.map((book) => (
        <BookCard key={book.itemId} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;
