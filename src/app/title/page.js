'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import HorizonValley from '@/components/valley/HorizonValley'

export default function TitlePage() {
  const router = useRouter()

  const handleSelectCharacter = () => {
    // Navigate to /character
    router.push('/character')
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="relative w-screen h-screen overflow-hidden bg-black select-none"
    >
      <HorizonValley onSelectCharacter={handleSelectCharacter} />
    </motion.main>
  )
}
