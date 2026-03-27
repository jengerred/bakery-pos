"use client";

type Props = {
  onDone: () => void;
};

export default function ReaderReceiptOptionsScreen({ onDone }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-gray-700">

      <h2 className="text-xl font-semibold">Receipt Options</h2>

      {/* Email Receipt */}
      <button
        onClick={onDone}
        className="w-48 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Email Receipt
      </button>

      {/* Text Receipt */}
      <button
        onClick={onDone}
        className="w-48 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Text Receipt
      </button>

      {/* No Receipt */}
      <button
        onClick={onDone}
        className="w-48 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        No Receipt
      </button>
    </div>
  );
}
