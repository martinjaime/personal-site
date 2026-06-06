import type { MarkdownLayoutProps } from "astro"
import type { ProjectFrontmatter } from "@/lib/types"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

interface NavProps {
  currentPath: string
}

const projects = Object.values(
  import.meta.glob("../pages/projects/*.mdx", { eager: true })
) as MarkdownLayoutProps<ProjectFrontmatter>[]

const sortProjects = (projects: MarkdownLayoutProps<ProjectFrontmatter>[]) => {
  return projects
    .sort((a, b) => b.frontmatter.year.localeCompare(a.frontmatter.year))
    .filter((project) => project.frontmatter.state !== "archived")
}

const Nav: React.FC<NavProps> = ({ currentPath }) => {
  return (
    <div className="w-full">
      <NavigationMenu
        viewport={false}
        className="mx-auto flex max-w-xl flex-row justify-end px-6 pt-4"
      >
        <NavigationMenuList>
          {currentPath !== "/" && (
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Home</NavigationMenuLink>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem className="relative">
            {/* weirdly enough, this component has a different font weight, so have to manually set it */}
            <NavigationMenuTrigger className="font-normal">
              Projects
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute right-0 left-auto z-50 min-w-max">
              {sortProjects(projects).map((project) => (
                <NavigationMenuLink
                  className="min-w-5 border-b border-border/40 last:border-b-0"
                  href={project.url}
                >
                  {project.frontmatter.title}
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem> */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink href="/contact">Say hi</NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Nav
