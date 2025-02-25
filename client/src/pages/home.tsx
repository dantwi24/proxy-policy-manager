import ProxyRequestForm from "@/components/ProxyRequestForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Proxy Policy Management
        </h1>
        <ProxyRequestForm />
      </div>
    </div>
  );
}
