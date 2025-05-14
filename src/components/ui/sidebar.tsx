
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToolsStore } from "@/store/toolsStore";
import { toast } from "sonner";

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { isOpen } = useSidebar();

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 data-[state=closed]:w-[60px] data-[state=open]:w-[280px] lg:relative",
        className
      )}
      {...props}
    />
  );
}

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center border-b px-4 lg:h-[60px]",
        className
      )}
      {...props}
    />
  );
}

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-auto", className)} {...props} />
  );
}

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  const resetAllTools = useToolsStore(state => state.resetAllTools);
  
  const handleResetAll = () => {
    resetAllTools();
    toast.success("All tools have been reset to their initial state.");
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t p-4",
        className
      )}
      {...props}
    >
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 text-sm"
        onClick={handleResetAll}
      >
        <RotateCcw size={14} />
        Reset All Tools
      </Button>
    </div>
  );
}

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { toggle } = useSidebar();

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
        className
      )}
      onClick={toggle}
      {...props}
    />
  );
}

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function SidebarGroup({
  className,
  children,
  isCollapsible = false,
  defaultCollapsed = false,
  ...props
}: SidebarGroupProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { isOpen } = useSidebar();

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}

export interface SidebarGroupLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({
  className,
  ...props
}: SidebarGroupLabelProps) {
  const { isOpen } = useSidebar();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "px-2 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({
  className,
  ...props
}: SidebarGroupContentProps) {
  return <div className={cn("pb-2", className)} {...props} />;
}

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}

export interface SidebarMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({
  className,
  ...props
}: SidebarMenuItemProps) {
  return <div className={cn("px-2", className)} {...props} />;
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function SidebarMenuButton({
  className,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const { isOpen } = useSidebar();
  const Comp = asChild ? React.Slot : "button";

  return (
    <Comp
      className={cn(
        "flex w-full cursor-pointer items-center rounded-lg py-1.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isOpen
          ? "justify-start px-2 hover:bg-accent hover:text-accent-foreground"
          : "justify-center",
        className
      )}
      {...props}
    />
  );
}
