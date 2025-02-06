import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

export default function FileConverter() {
    return (
        /* Demo Section */
        <section
            id="demo"
            className="py-16 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg shadow-2xl overflow-hidden relative"
        >
            <div className="absolute inset-0 opacity-50 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center"></div>
            <div className="max-w-3xl mx-auto px-4 relative">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">
                    Initiate Conversion Sequence
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        type="file"
                        className="flex-grow bg-white/10 border-0 text-white placeholder-gray-300"
                    />
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full">
                        Convert <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
