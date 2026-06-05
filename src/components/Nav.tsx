import type { MarkdownLayoutProps } from "astro";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

interface NavProps {
  currentPath: string;
}

const projects = Object.values(import.meta.glob("../pages/projects/*.mdx", { eager: true })) as MarkdownLayoutProps<ProjectFrontmatter>[];

const sortProjects = (projects: MarkdownLayoutProps<ProjectFrontmatter>[]) => {
  return projects
    .sort((a, b) => b.frontmatter.year.localeCompare(a.frontmatter.year))
    .filter(project => project.frontmatter.state !== "archived");
}

const Nav: React.FC<NavProps> = ({ currentPath }) => {
  return (
    <div className="w-full">
      <NavigationMenu viewport={false} className="max-w-xl px-6 pt-4 mx-auto flex flex-row justify-end">
        <NavigationMenuList>
          {currentPath !== "/" && (
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem className="relative">
            {/* weirdly enough, this component has a different font weight, so have to manually set it */}
            <NavigationMenuTrigger className="font-normal">Projects</NavigationMenuTrigger>
            <NavigationMenuContent className="absolute z-50 right-0 left-auto min-w-max">
              {(sortProjects(projects)).map(project => (
                <NavigationMenuLink className="border-b border-border/40 last:border-b-0 min-w-5" href={project.url}>
                  {project.frontmatter.title}
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink href="/contact">Say hi</NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Nav;
