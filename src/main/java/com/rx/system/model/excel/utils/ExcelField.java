/*
 * Copyright (c) 2015, FPX and/or its affiliates. All rights reserved.
 * Use, Copy is subject to authorized license.
 *
 */
package com.rx.system.model.excel.utils;

import java.io.Serializable;


public class ExcelField implements Serializable {

    public ExcelField(){}

    public ExcelField(String name, String value) {
        this.name = name;
        this.value = value;
    }

    private String name;

    private String value;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
