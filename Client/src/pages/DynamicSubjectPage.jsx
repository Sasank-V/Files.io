import axios from '@/api/axios';
import LoadingComponent from '@/components/loading';
import useAuth from '@/hooks/useAuth';
import useSubjects from '@/hooks/useSubjects';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Lazy loading the components for better performance
const SyllabusComponent = lazy(() => import('@/components/subject/SyllabusComponent'));
const LessonPlan = lazy(() => import('@/components/subject/LessonPlan'));
const TheoryComponent = lazy(() => import('@/components/subject/TheoryComponent'));
const LabsComponent = lazy(() => import('@/components/subject/LabsComponent'));
const AssignmentsComponent = lazy(() => import('@/components/subject/AssignmentsComponent'));
const ModelQPComponent = lazy(() => import('@/components/subject/ModelQPComponent'));
const TutorialVideosComponent = lazy(() => import('@/components/subject/TutorialVideosComponent'));

const SyllabusUploadComponent = lazy(() => import('@/components/uploadPage/SyllabusUploadComponent'));
const LessonPlanUploadComponent = lazy(() => import('@/components/uploadPage/LessonPlanUploadComponent'));
const TheoryUploadComponent = lazy(() => import('@/components/uploadPage/TheoryUploadComponent'));
const LabsUploadComponent = lazy(() => import('@/components/uploadPage/LabsUploadComponent'));
// const AssignmentsComponent = lazy(() => import('@/components/subject/AssignmentsComponent'));
// const ModelQPComponent = lazy(() => import('@/components/subject/ModelQPComponent'));
// const TutorialVideosComponent = lazy(() => import('@/components/subject/TutorialVideosComponent'));

// Mapping type to corresponding component

const DynamicSubjectComponent = () => {
    const { auth } = useAuth();

    const componentMap = {
        0: !auth.isAdmin ? SyllabusComponent : SyllabusUploadComponent,
        1: !auth.isAdmin ? LessonPlan : LessonPlanUploadComponent,
        2: !auth.isAdmin ? TheoryComponent : TheoryUploadComponent,
        3: !auth.isAdmin ? LabsComponent : LabsUploadComponent,
        4: !auth.isAdmin ? AssignmentsComponent : AssignmentsComponent,
        5: !auth.isAdmin ? ModelQPComponent : ModelQPComponent,
        6: !auth.isAdmin ? TutorialVideosComponent : TutorialVideosComponent,
    };

    const { id } = useParams();
    const SubjectComponent = componentMap[id];

    const subjectId = new URLSearchParams(location.search).get("id");

    // useEffect(() => {
    //     const fetchSubjectDetails = async () => {
    //         const subject = subjects.find((sub) => sub.id === subjectId);

    //         setCurrentSubject(subject);
    //     }

    //     fetchSubjectDetails();
    // }, [])

    if (!SubjectComponent) {
        return <div>Invalid subject type!</div>;
    }

    return (
        <Suspense fallback={<LoadingComponent />}>
            <SubjectComponent subjectId={subjectId} />
        </Suspense>
        // <LoadingComponent />
    );
};

export default DynamicSubjectComponent;
