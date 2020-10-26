package com.gradle.tool;

import java.util.ArrayList;
import java.util.List;

public class ProjectItem {
    public final String name;
    public final String folder;
    public final List<String> tasks = new ArrayList<>();

    public ProjectItem(String name, String folder) {
        this.name = name;
        this.folder = folder;
    }
}
