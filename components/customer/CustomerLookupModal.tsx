"use client"

import { useState } from "react"
import { userService } from "../../lib/userService"
import type { User } from "../../types/user"

export default function CustomerLookupModal({
  onFound,
  onNotFound,
  onClose,
}: {
  onFound: (user: User) => void
  onNotFound: (value: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState("")

  const handleLookup = async () => {
    const found = await userService.find(value)

    if (found) {
      onFound(found)
    } else {
      onNotFound(value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Lookup Customer</h2>

        <input
          className="border p-2 w-full mb-4"
          placeholder="Phone or Email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full py-2 rounded mb-3"
          onClick={handleLookup}
        >
          Search
        </button>

        <button className="text-gray-600 underline w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
