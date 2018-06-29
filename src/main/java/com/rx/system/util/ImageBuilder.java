package com.rx.system.util;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;

import javax.imageio.ImageIO;

public class ImageBuilder {
	
	public static void build(String text, int width, int height,String origImgUrl,String targetUrl) throws Exception{
		Image backGround = ImageIO.read(new File(origImgUrl));
		
		BufferedImage image = new BufferedImage(backGround.getWidth(null),backGround.getHeight(null),BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics = image.createGraphics();
		
		image = graphics.getDeviceConfiguration().createCompatibleImage(width, height,Transparency.TRANSLUCENT);
		graphics.dispose();
		graphics = image.createGraphics();
		
		graphics.setStroke(new BasicStroke(1));
		graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
		graphics.drawImage(
				backGround.getScaledInstance(backGround.getWidth(null), backGround.getHeight(null),Image.SCALE_SMOOTH), 
				0,
				0,
				null);
		graphics.setColor(Color.WHITE);
		graphics.setFont(new Font("Arial",Font.BOLD,15));
		float alpha = 1f;
		
		graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP,alpha));
		
		graphics.drawString(text, width/(text.length()+2), height/2+5);
		graphics.dispose();
		
		FileOutputStream out = new FileOutputStream(new File(targetUrl+text+".png"));
		ImageIO.write(image, "PNG", out);
		out.close();
	}
	
	public static void delete(String imageName,String imageUrl) throws Exception{
		String resourceUrl = imageUrl + imageName;
		File file = new File(resourceUrl);
		if(file.exists())
			file.delete();
	}
	
	public static void main(String[] args) {
		try {
			ImageBuilder.build("C2", 36, 36,"C:\\b.png","D:\\");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void testDelete()throws Exception{
		try {
			ImageBuilder.delete("F5.png", "F:\\Works\\Tools\\Tomcat 5.0\\webapps\\bsbbsc\\"+"bsc\\img\\");
		} catch (RuntimeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
