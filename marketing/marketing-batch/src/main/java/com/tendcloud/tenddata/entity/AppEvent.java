package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;
import org.msgpack.MessagePackable;
import org.msgpack.MessageTypeException;
import org.msgpack.annotation.Message;
import org.msgpack.annotation.Optional;
import org.msgpack.packer.Packer;
import org.msgpack.type.RawValue;
import org.msgpack.type.Value;
import org.msgpack.unpacker.Unpacker;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Bison
 * @since 2011-9-19
 */
@Message
public class AppEvent implements TDMessagePackable, MessagePackable {
	/**
	 * 开发者自定义事件的ID
	 */
	public String id = "";
	public String label = "";
	public int count;

	@Optional
	public long startTime;

	@Optional
	public Map<String, Object> parameters;

	@Override
	public void messagePack(final TDPacker pk) throws IOException {
		pk.packArray(5);
		pk.pack(id);
		pk.pack(label);
		pk.pack(count);
		pk.pack(startTime);
		pk.pack(parameters);
	}

	@Override
	public void writeTo(Packer pk) throws IOException {
		// TODO Auto-generated method stub

	}

	@Override
	public void readFrom(Unpacker pac) throws IOException {
		int length = pac.readArrayBegin();
		if (length > 5 ||  length<3) {
			throw new MessageTypeException();
		}
		id = pac.readString();
		// pac.
		if (pac.trySkipNil()) {
			label = null;
		} else {
			label = pac.readString();
		}
		count = pac.readInt();
		if(length>3){
			startTime = pac.readLong();
		}
		
		if(length>4){
			if(pac.trySkipNil()){
				parameters = null;
			}else{
				int mapLength = pac.readMapBegin();
				parameters = new HashMap<String, Object>(16);
				for (int i = 0; i < mapLength; i++) {
					String key = pac.readString();
					Value value = pac.readValue();
					if(value instanceof Number){
						if (value.isIntegerValue()) {
							parameters.put(key, ((Number)value).intValue());
						} else {
							parameters.put(key, ((Number)value).doubleValue());
						}
					}else if(value instanceof RawValue){
						parameters.put(key, ((RawValue) value).getString());
					}
				}
				pac.readMapEnd();
			}
		}
		pac.readArrayEnd();
	}

	@Override
	public String toString() {
		return new StringBuilder("AppEvent").append(Printag.OBJSTARTAG)
				.append(this.getClass().getName()).append(Printag.OBJENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE)
				.append(Printag.SPACE).append(Printag.SPACE).append("id")
				.append(Printag.STARTAG).append(id).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE)
				.append(Printag.SPACE).append(Printag.SPACE).append("label")
				.append(Printag.STARTAG).append(label).append(Printag.ENDTAG)
				.append(Printag.SPACE).append(Printag.SPACE)
				.append(Printag.SPACE).append(Printag.SPACE)
				.append("startTime").append(Printag.STARTAG).append(startTime)
				.append(Printag.ENDTAG).append(Printag.SPACE)
				.append(Printag.SPACE).append(Printag.SPACE)
				.append(Printag.SPACE).append("count").append(Printag.STARTAG)
				.append(count).append(Printag.ENDTAG).append(Printag.SPACE)
				.append(Printag.SPACE).append(Printag.SPACE)
				.append(Printag.SPACE).append("parameters")
				.append(Printag.STARTAG).append(parameters)
				.append(Printag.ENDTAG).toString();
	}
}
