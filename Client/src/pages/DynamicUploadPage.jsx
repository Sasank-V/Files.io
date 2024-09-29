import LoadingComponent from '@/components/loading';
import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

// Lazy loading the components for better performance
const SyllabusUploadComponent = lazy(() => import('@/components/uploadPage/SyllabusUploadComponent'));
const LessonPlanUploadComponent = lazy(() => import('@/components/uploadPage/LessonPlanUploadComponent'));
const TheoryUploadComponent = lazy(() => import('@/components/uploadPage/TheoryUploadComponent'));
const LabsComponent = lazy(() => import('@/components/subject/LabsComponent'));
const AssignmentsComponent = lazy(() => import('@/components/subject/AssignmentsComponent'));
const ModelQPComponent = lazy(() => import('@/components/subject/ModelQPComponent'));
const TutorialVideosComponent = lazy(() => import('@/components/subject/TutorialVideosComponent'));

// Mapping type to corresponding component
const componentMap = {
    0: SyllabusUploadComponent,
    1: LessonPlanUploadComponent,
    2: TheoryUploadComponent,
    3: LabsComponent,
    4: AssignmentsComponent,
    5: ModelQPComponent,
    6: TutorialVideosComponent,
};

const DynamicSubjectComponent = () => {
    const { id } = useParams();
    const SubjectComponent = componentMap[id];

    if (!SubjectComponent) {
        return <div>Invalid subject type!</div>;
    }

    return (
        <Suspense fallback={<LoadingComponent />}>
            <SubjectComponent />
        </Suspense>
        // <LoadingComponent />
    );
};

export default DynamicSubjectComponent;
