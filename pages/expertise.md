---
title: Expertise - Michelangelo De Francesco
display: Expertise
description: My career path and education
plum: true
wrapperClass: 'text-center'
projects:
  Low Latency Development:
    - name: 'Java'
      link: 'https://www.java.com/it/'
      desc: 'Classical OOP with garbage collection'
      icon: 'i-mdi:language-java'
    - name: 'Scala'
      link: 'https://scala-lang.org/'
      desc: 'Functional Programming that enhances defensive programming'
      icon: 'i-simple-icons:scala'
    - name: 'LMAX Disruptor'
      link: 'https://lmax-exchange.github.io/disruptor/'
      desc: 'Best data structure for concurrency'
      icon: "i-material-symbols:cycle"
    - name: 'Kafka'
      link: 'https://kafka.apache.org/'
      desc: 'Event Driven Development with ease'
      icon: "i-simple-icons:apachekafka"
    - name: 'Aeron'
      link: 'https://aeroncookbook.com/'
      desc: 'Send messages with extreme performance'
      icon: "i-carbon:flow-stream"
    - name: 'SBE'
      link: 'https://github.com/real-logic/simple-binary-encoding'
      desc: 'Encrypt and decrypt messages without allocation'
      icon: "i-lucide:binary"
    - name: 'FIX'
      desc: 'Protocol for messages in the market'
      icon: "i-lucide:binary"
  Low Latency Techniques:
    - name: 'Event Driven Development'
      desc: 'React to market changes'
      icon: "i-mdi:transit-connection-horizontal"
    - name: 'Low Object Allocation'
      desc: 'Reduce the garbage collection'
      icon: "i-material-symbols:auto-delete"
  Services Development:
    - name: 'Python'
      link: 'https://www.python.org/'
      desc: 'Data analysis and fast development'
      icon: "i-mdi:language-python"
    - name: 'Javascript'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'Flexibility from backend to frontend'
      icon: "i-mdi:language-javascript"
    - name: 'Typescript'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'Ensure type safety in Javascript'
      icon: "i-mdi:language-typescript"
  Databases:
    - name: 'SQL'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'Extract value from data'
      icon: "i-ph:file-sql"
    - name: 'MySQL'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'Classical relational database'
      icon: "i-tabler:brand-mysql"
    - name: 'PostgreSQL'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'More than just a relational database'
      icon: "i-akar-icons:postgresql-fill"
    - name: 'Clickhouse'
      link: 'https://clickhouse.com/'
      desc: 'Ingestion power of OLAP DB'
      icon: "i-simple-icons:clickhouse"
  DevOps:
    - name: 'Docker'
      link: 'https://www.docker.com/'
      desc: 'Deploy in a deterministic way'
      icon: "i-mdi:docker"
    - name: 'CI/CD & Pipelines'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'Automated deploys and coverage analytics'
      icon: "i-eos-icons:pipeline"
  Tools:
    - name: 'Grafana'
      link: 'https://github.com/slidevjs/slidev'
      desc: 'Platform monitoring and data analytics'
      icon: "i-simple-icons:grafana"


---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />

