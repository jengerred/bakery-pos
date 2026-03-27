"use client"

import { useState } from "react"
import { userService } from "../../lib/userService"
import type { User } from "../../types/user"

export default function QuickCreateCustomerModal({
  initialValue,
  onCreate,
  onClose,
}: {
  initialValue: string
  onCreate: (user: User) => void
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [value, setValue] = useState(initialValue)

  const handleCreate = async () => {
    const newUser = await userService.create({
      name,
      phone: value.includes("@") ? undefined : value,
      email: value.includes("@") ? value : undefined,
    })

    onCreate(newUser)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Quick Sign Up</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Phone or Email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          className="bg-green-600 text-white w-full py-2 rounded mb-3"
          onClick={handleCreate}
        >
          Create Account
        </button>

        <button className="text-gray-600 underline w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
