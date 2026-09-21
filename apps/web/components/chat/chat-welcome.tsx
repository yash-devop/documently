export function ChatWelcome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-10 text-center">
      <h1 className="max-w-xl text-balance text-2xl font-medium tracking-tight md:text-3xl">
        What can I help you with?
      </h1>
      <p className="max-w-md text-sm text-foreground-lighter">
        Upload your documents and ask questions — get instant answers. Your
        chats stay saved in the sidebar.
      </p>
    </div>
  );
}