package com.gradle.tool;

import org.gradle.tooling.GradleConnectionException;
import org.gradle.tooling.GradleConnector;
import org.gradle.tooling.ProjectConnection;
import org.gradle.tooling.ResultHandler;
import org.gradle.tooling.model.DomainObjectSet;
import org.gradle.tooling.model.GradleProject;
import org.gradle.tooling.model.GradleTask;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

class GradleWrapper {
    private ProjectConnection mConnection;
    private List<GradleProject> mProjects = new ArrayList<>();

    GradleWrapper(String projectPath) {
        getConnection(projectPath);
    }

    void disconnect() {
        mConnection.close();
    }

    List<ProjectItem> enumerateTasks() {
        List<ProjectItem> result = new ArrayList<>();

        enumerateProjects();

        for (GradleProject project : mProjects) {
            ProjectItem item = new ProjectItem(
                    project.getName(),
                    project.getPath()
            );

            for (GradleTask task : project.getTasks()) {
                if (task.isPublic()) {
                    item.tasks.add(task.getName());
                }
            }

            result.add(item);
        }

        return result;
    }

    boolean executeTask(String taskName) {
        final boolean[] isCompleted = {false};
        final boolean[] result = {false};
        mConnection.newBuild().forTasks(taskName).setStandardOutput(System.out).run(new ResultHandler<Object>() {
            @Override
            public void onComplete(Object r) {
                result[0] = true;
                isCompleted[0] = true;
            }

            @Override
            public void onFailure(GradleConnectionException failure) {
                isCompleted[0] = true;
            }
        });

        // Wait for task completion
        while (!isCompleted[0]) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        return result[0];
    }

    private void getConnection(String projectPath) {
        GradleConnector connector = GradleConnector.newConnector();
        connector.forProjectDirectory(new File(projectPath));
        mConnection = connector.connect();
    }

    private void enumerateProjects() {
        GradleProject project = mConnection.getModel(GradleProject.class);
        DomainObjectSet<? extends GradleProject> projects = project.getChildren();
        if (!projects.isEmpty()) {
            mProjects.add(project);
            mProjects.addAll(projects);
        } else {
            mProjects.add(project);
        }
    }
}
