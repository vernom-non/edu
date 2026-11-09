// ============================================================================
// EduExplore – End-to-End Component, Curriculum & Simulation Flow Tests via Vite SSR
// Kiểm tra toàn bộ giao diện React, Phòng học tương tác, Xưởng sáng tạo và 9 bài học
// ============================================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import { INITIAL_LESSONS } from '../data/curriculumData.ts';

describe('EduExplore Full Application & Interactive Simulations Render Verification', () => {
  it('renders App, InteractiveClassroom (all 9 lessons), CreativeStudio, and RoleDashboards cleanly via Vite', async () => {
    const server = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      logLevel: 'error',
    });

    try {
      const { App } = await server.ssrLoadModule('/src/App.tsx');
      const { InteractiveClassroom } = await server.ssrLoadModule(
        '/src/components/classroom/InteractiveClassroom.tsx'
      );
      const { CreativeStudio } = await server.ssrLoadModule(
        '/src/components/studio/CreativeStudio.tsx'
      );
      const { ExerciseBankArena } = await server.ssrLoadModule(
        '/src/components/exercises/ExerciseBankArena.tsx'
      );
      const { CuriosityEngineView } = await server.ssrLoadModule(
        '/src/components/curiosity/CuriosityEngineView.tsx'
      );
      const { CreativeProjectsView } = await server.ssrLoadModule(
        '/src/components/projects/CreativeProjectsView.tsx'
      );
      const {
        ThinkingChallengesView,
        ParentDashboardView,
        TeacherDashboardView,
        AdminCMSView,
      } = await server.ssrLoadModule('/src/components/dashboards/RoleDashboards.tsx');

      // 1. Kiểm tra Trang chủ Tối giản (4 khu vực chính) & Điều hướng 4 mục
      const homeHtml = renderToString(React.createElement(App));
      assert.ok(homeHtml.includes('EduExplore'));
      assert.ok(
        homeHtml.includes('Phòng Thí Nghiệm Kiến Thức Trực Quan Dành Cho Trẻ Em')
      );
      assert.ok(homeHtml.includes('Tiếp tục học'));
      assert.ok(homeHtml.includes('Học tiếp'));
      assert.ok(homeHtml.includes('Khám phá môn học'));
      assert.ok(homeHtml.includes('Khám phá hôm nay'));
      assert.ok(homeHtml.includes('Xưởng sáng tạo'));
      assert.ok(homeHtml.includes('Trang chủ'));
      assert.ok(homeHtml.includes('Môn học'));
      assert.ok(homeHtml.includes('Khám phá'));
      assert.ok(homeHtml.includes('Của em'));
      for (const grade of [1, 2, 3, 4, 5]) {
        assert.ok(homeHtml.includes(`Lớp ${grade}`), `Missing Grade ${grade}`);
      }

      // 2. Kiểm tra cả 9 bài học tương tác (5 MVP + 4 Mở rộng)
      for (const lesson of INITIAL_LESSONS) {
        const classroomHtml = renderToString(
          React.createElement(InteractiveClassroom, {
            lesson,
            voiceEnabled: false,
            reducedMotion: false,
            focusMode: false,
            onToggleFocusMode: () => {},
            onUpdateProgress: () => {},
            onBackToCatalog: () => {},
            onNextLesson: () => {},
          })
        );

        const escapedTitle = lesson.title.replace(/&/g, '&amp;');
        assert.ok(
          classroomHtml.includes(escapedTitle),
          `Missing lesson title for ${lesson.id}`
        );
        assert.ok(
          classroomHtml.includes('Kiến thức khoa học thực tế'),
          `Missing scientific fact note for ${lesson.id}`
        );
        assert.ok(
          classroomHtml.includes('Lưu ý Mô hình đơn giản hóa'),
          `Missing model simplification note for ${lesson.id}`
        );
        assert.ok(
          classroomHtml.includes('Trợ giảng Gợi mở Socratic'),
          `Missing Socratic tutor panel for ${lesson.id}`
        );
      }

      // 3. Kiểm tra Xưởng sáng tạo (5 công cụ)
      const studioHtml = renderToString(
        React.createElement(CreativeStudio, { voiceEnabled: false })
      );
      assert.ok(studioHtml.includes('Xưởng Sáng Tạo EduExplore'));
      assert.ok(studioHtml.includes('Mini Coding Lab'));
      assert.ok(studioHtml.includes('Logic Playground'));
      assert.ok(studioHtml.includes('Creative Builder'));
      assert.ok(studioHtml.includes('Story Creator'));
      assert.ok(studioHtml.includes('What If Lab'));

      // 4. Kiểm tra các Dashboard Phân quyền (Thử thách, Phụ huynh, Giáo viên, Admin CMS)
      const challengesHtml = renderToString(
        React.createElement(ThinkingChallengesView, { voiceEnabled: false })
      );
      assert.ok(challengesHtml.includes('Cửa hàng Văn phòng phẩm Nhí'));

      const parentHtml = renderToString(
        React.createElement(ParentDashboardView, {
          profile: {
            id: 'stu-1',
            name: 'Bé Bắp',
            currentGrade: 1,
            role: 'parent',
            dailyLimitMinutes: 45,
            todayMinutesUsed: 10,
            accessibility: {
              voiceGuide: true,
              reducedMotion: false,
              largeText: false,
              highContrast: false,
              focusMode: false,
            },
            progressMap: {},
          },
          onUpdateDailyLimit: () => {},
          onResetStudentData: () => {},
        })
      );
      assert.ok(parentHtml.includes('Quyền Riêng tư &amp; Kiểm soát Dữ liệu Trẻ em'));

      const teacherHtml = renderToString(
        React.createElement(TeacherDashboardView, {
          lessons: INITIAL_LESSONS,
          onStartLesson: () => {},
        })
      );
      assert.ok(teacherHtml.includes('Phòng Giáo viên'));

      const adminHtml = renderToString(
        React.createElement(AdminCMSView, {
          lessons: INITIAL_LESSONS,
          onAddOrUpdateLesson: () => {},
        })
      );
      assert.ok(adminHtml.includes('Quản trị Nội dung Bài giảng'));

      // 5. Kiểm tra Ngân hàng 36 Dạng bài tập & Hệ thống Biến thể
      const exerciseHtml = renderToString(
        React.createElement(ExerciseBankArena, {
          voiceEnabled: false,
          onAwardPraise: () => {},
        })
      );
      assert.ok(exerciseHtml.includes('Hệ thống Sinh Biến thể Bài tập Có Kiểm soát'));
      assert.ok(exerciseHtml.includes('Khám phá Ngân hàng 36 Dạng Bài tập Đa phương thức'));

      // 6. Kiểm tra Cỗ máy Tò mò (Curiosity Engine + 2D Bridge Simulation)
      const curiosityHtml = renderToString(
        React.createElement(CuriosityEngineView, {
          voiceEnabled: false,
          onSaveNotebookEntry: () => {},
          onAwardPraise: () => {},
        })
      );
      assert.ok(curiosityHtml.includes('Hôm nay con tò mò điều gì?'));
      assert.ok(curiosityHtml.includes('Làm sao xây một chiếc cầu chắc chắn?'));

      // 7. Kiểm tra 5 Dự án Liên môn Sáng tạo
      const projectsHtml = renderToString(
        React.createElement(CreativeProjectsView, {
          voiceEnabled: false,
          savedProjects: {},
          onSaveProject: () => {},
          onAwardPraise: () => {},
        })
      );
      assert.ok(projectsHtml.includes('5 Dự Án Liên Môn Sáng Tạo'));
      assert.ok(projectsHtml.includes('Khu vườn của em'));
    } finally {
      await server.close();
    }
  });
});
