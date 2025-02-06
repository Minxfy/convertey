
import { Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function Hero(){
    return (
        /* Hero Section */
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600">
            Cosmo Converter
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
            Transform your files across the digital universe
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full"
          >
            <Rocket className="mr-2 h-5 w-5" /> Launch Converter
          </Button>
        </section>
    );
}

