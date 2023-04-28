interface NavItem {
    path: string;
    title: string;
    icon?: string;
  }
  
  const links: NavItem[] = [
    {
      path: 'estudiantes',
      title: 'Estudiantes',
      icon: 'person',
    },
    {
      path: 'cursos',
      title: 'Cursos',
      icon: 'school'
    },
  ]
  
  export default links;