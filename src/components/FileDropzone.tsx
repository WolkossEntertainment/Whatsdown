type Props = {
  onTextLoaded: (text: string) => void;
};

export function FileDropzone({ onTextLoaded }: Props) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onTextLoaded(reader.result);
      }
    };

    reader.readAsText(file);
  }

  return (
    <section style={{ marginBottom: "24px" }}>
      <label>
        <strong>Choose WhatsApp .txt export</strong>
        <br />
        <input type="file" accept=".txt" onChange={handleFileChange} />
      </label>
    </section>
  );
}