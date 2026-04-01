<script setup lang="ts">
const profile = {
  name: 'Rex Wang',
  title: '前端开发 | 产品经理',
  description: '不会设计的前端开发不是好产品经理，乐于主动探索各类新技术；崇尚极简主义，专注从 0 到 1 的创造过程；业余深耕明史，以历史逻辑沉淀思考，反哺技术与产品决策。',
  work: {
    company: '某互联网公司',
    position: '资深前端开发工程师 | 产品经理',
  },
  skills: [
    'AI coding',
    '前端开发',
    '产品设计',
    '用户体验',
    '项目管理',
  ],
  social: {
    github: 'https://github.com/OnlyProbie',
    email: 'onlyprobie@gmail.com',
  },
}
</script>

<template>
  <div class="profile-container">
    <ParticleNetwork />

    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <img src="/IMG_9606.JPG?url" alt="avatar" class="avatar-img">
        </div>
        <div class="profile-info">
          <h1 class="name">
            {{ profile.name }}
          </h1>
          <p class="title">
            {{ profile.title }}
          </p>
        </div>
      </div>

      <div class="profile-section">
        <p class="description">
          {{ profile.description }}
        </p>
      </div>

      <div class="profile-section">
        <h3 class="section-title">
          工作
        </h3>
        <div class="work-info">
          <span class="company">{{ profile.work.company }}</span>
          <span class="divider">·</span>
          <span class="position">{{ profile.work.position }}</span>
        </div>
      </div>

      <div class="profile-section">
        <h3 class="section-title">
          技能
        </h3>
        <div class="skills">
          <span
            v-for="skill in profile.skills"
            :key="skill"
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <div class="profile-section">
        <h3 class="section-title">
          联系方式
        </h3>
        <div class="contact">
          <a :href="profile.social.github" target="_blank" class="contact-link">
            <div i-uil-github-alt />
            <span>GitHub</span>
          </a>
          <a :href="`mailto:${profile.social.email}`" class="contact-link">
            <div i-ri-mail-line />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  overflow: hidden;
}

.profile-card {
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 2rem 0;
  border-radius: 1rem;
  border: 1px solid var(--c-border);
  background: transparent;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: var(--c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--c-border);
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.title {
  font-size: 1rem;
  opacity: 0.7;
  margin: 0.25rem 0 0;
}

.profile-section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.6;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.work-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.divider {
  opacity: 0.5;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  font-size: 0.875rem;
}

.contact {
  display: flex;
  gap: 1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
  font-size: 0.95rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.contact-link:hover {
  opacity: 1;
}
</style>
