"use client"

import { useState } from "react"

export default function RewardsPromptModal({
  onLookup,
  onCreate,
  onGuest,
}: {
  onLookup: () => void
  onCreate: () => void
  onGuest: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Earn Rewards Today?</h2>

        <button
          className="bg-blue-600 text-white w-full py-2 rounded mb-3"
          onClick={onLookup}
        >
          Look up account
        </button>

        <button
          className="bg-green-600 text-white w-full py-2 rounded mb-3"
          onClick={onCreate}
        >
          Sign up quickly
        </button>

        <button
          className="text-gray-600 underline w-full"
          onClick={onGuest}
        >
          No thanks (Guest)
        </button>
      </div>
    </div>
  )
}
