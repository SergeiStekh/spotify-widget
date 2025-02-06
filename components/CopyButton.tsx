import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

interface CopyButtonProps {
  contentToCopy: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({contentToCopy}) => {
  const { toast } = useToast();

  const copyToClipboard = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data)
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text.",
        variant: "destructive",
      });
    }
  }

  return (
  <Button onClick={() => copyToClipboard(contentToCopy)} variant="outline" size="icon" className="shrink-0">
    <Copy className="h-4 w-4" />
  </Button>
  )
}