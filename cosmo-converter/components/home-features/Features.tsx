
import { FileUp, Zap, Globe } from "lucide-react";

export default function Features() {
  return (
    /* Features Section */
    <section id="features" className="py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">Cosmic Capabilities</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FileUp className="h-10 w-10 text-purple-500" />}
          title="Universal Formats"
          description="Convert files across dimensions and formats with unparalleled precision."
        />
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-pink-500" />}
          title="Quantum Speed"
          description="Experience conversions at the speed of light, powered by advanced algorithms."
        />
        <FeatureCard
          icon={<Globe className="h-10 w-10 text-blue-500" />}
          title="Galactic Access"
          description="Access and convert your files from any corner of the known universe."
        />
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-lg text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="mb-4 transform transition-transform duration-300 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
