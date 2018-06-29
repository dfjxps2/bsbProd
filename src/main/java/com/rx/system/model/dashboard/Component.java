package com.rx.system.model.dashboard;

import java.awt.Dimension;

public interface Component {
	public void setUnitSize(Dimension d);
	public String getOutput() throws Exception;
}
