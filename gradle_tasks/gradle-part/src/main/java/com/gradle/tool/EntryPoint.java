package com.gradle.tool;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gradle.tooling.model.DomainObjectSet;
import org.gradle.tooling.model.GradleProject;
import org.gradle.tooling.model.GradleTask;

import java.util.List;
import java.util.Map;

public class EntryPoint {
    public static void main(String[] args) {
        if (args.length == 2) {
            String projectPath = args[0];
            String command = args[1];

            GradleWrapper gradle = new GradleWrapper(projectPath);
            if (command.equals("__VSC_ENUM_TASKS__")) {
                List<ProjectItem> tasks = gradle.enumerateTasks();
                ObjectMapper mapper = new ObjectMapper();

                try {
                    String jsonInString = mapper.writeValueAsString(tasks);
                    System.out.println("GRADLE-WRAPPER-RESULT:");
                    System.out.println(jsonInString);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println(gradle.executeTask(command));
            }

            gradle.disconnect();
        }
    }
}
