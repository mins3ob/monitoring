import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IProjectWithStats } from '@interfaces/index';
import ImgNoImg from '@public/imgs/img_no_img.png';

interface ProjectCardProps {
  project: IProjectWithStats;
  actionButtons?: React.ReactNode;
}

export default function ProjectCard({ project, actionButtons }: ProjectCardProps) {
  const router = useRouter();

  return (
    <div
      className="box"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        padding: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h3 style={{ margin: 0 }}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              router.push(`?view=detail&id=${project.id}`);
            }}
          >
            {project.name} {project.status}
          </a>
        </h3>
      </div>

      <button
        type="button"
        onClick={() => router.push(`?view=detail&id=${project.id}`)}
        style={{ background: 'none', color: 'var(--font-color)', textAlign: 'left' }}
      >
        <div
          style={{
            width: '100%',
            height: '200px',
            marginBottom: '12px',
            position: 'relative',
          }}
        >
          <Image
            src={project.imageUrl || ImgNoImg.src}
            alt={project.name}
            fill
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </div>

        <p>설명: {project.description}</p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <p>LOT: {project.lotCount}</p>
          <p>성공: {project.successCount}</p>
          <p>실패: {project.failCount}</p>
        </div>

        <div>
          <p>공정:</p>
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              flexWrap: 'wrap',
              rowGap: '12px',
            }}
          >
            {project.processes.map((process, idx) => (
              <React.Fragment key={process.id}>
                <li
                  style={{
                    background: 'var(--gray-50)',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  {process.name}
                </li>
                {idx < project.processes.length - 1 && (
                  <span style={{ color: 'var(--gray-400)' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </button>

      {actionButtons && (
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid var(--gray-100)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {actionButtons}
        </div>
      )}
    </div>
  );
}
