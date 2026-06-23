export type ProjectFrontmatter = {
  title: string
  year: string
  snippet: string
  state: "draft" | "published" | "archived"
}

export type WorkerResponse = {
  success: boolean
  message?: string
}
