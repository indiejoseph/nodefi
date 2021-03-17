export interface ProjectSocialLink {
  type: string;
  title: string;
  url: string;
}

export interface Project {
  slug: string;
  name: string;
  socialLinks: ProjectSocialLink[];
  description?: string;
  logo?: string;
  website?: string;
}
