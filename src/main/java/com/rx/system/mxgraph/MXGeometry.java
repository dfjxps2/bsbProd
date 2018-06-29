package com.rx.system.mxgraph;

import java.io.Serializable;

@SuppressWarnings("serial")
public class MXGeometry implements Serializable{
	private double x;
	private double y;
	private double width;
	private double height;
	private String as="geometry";
	private boolean relative=false;
	private double[][] points=null;
	
	public double getX() {
		return x;
	}
	public void setX(double x) {
		this.x = x;
	}
	public double getY() {
		return y;
	}
	public void setY(double y) {
		this.y = y;
	}
	public double getWidth() {
		return width;
	}
	public void setWidth(double width) {
		this.width = width;
	}
	public double getHeight() {
		return height;
	}
	public void setHeight(double height) {
		this.height = height;
	}
	public String getAs() {
		return as;
	}
	public void setAs(String as) {
		this.as = as;
	}
	public double[][] getPoints() {
		return points;
	}
	public void setPoints(double[][] points) {
		this.points = points;
	}
	public boolean isRelative() {
		return relative;
	}
	public void setRelative(boolean relative) {
		this.relative = relative;
	}
}
