//
// MessagePack for Java
//
// Copyright (C) 2009-2010 FURUHASHI Sadayuki
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//
package com.tendcloud.tenddata.msgpack;

import com.tendcloud.tenddata.entity.TDMessagePackable;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Packer enables you to serialize objects into OutputStream.
 *
 * <pre>
 * // create a packer with output stream
 * Packer pk = new Packer(System.out);
 *
 * // store an object with pack() method.
 * pk.pack(1);
 *
 * // you can store String, List, Map, byte[] and primitive types.
 * pk.pack(new ArrayList());
 * </pre>
 *
 * You can serialize objects that implements {@link TDMessagePackable}
 * interface.
 * @author sheng.hong
 */
public class TDPacker {

    protected byte[] castBytes = new byte[9];
    protected OutputStream out;

    public TDPacker(final OutputStream out) {
        this.out = out;
    }

    public TDPacker pack(final BigInteger o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packBigInteger(o);
    }

    public TDPacker pack(final boolean o) throws IOException {
        if (o) {
            return packTrue();
        } else {
            return packFalse();
        }
    }

    public TDPacker pack(final Boolean o) throws IOException {
        if (o == null) {
            return packNil();
        }
        if (o) {
            return packTrue();
        } else {
            return packFalse();
        }
    }

    public TDPacker pack(final byte o) throws IOException {
        return packByte(o);
    }

    public TDPacker pack(final Byte o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packByte(o);
    }

    public TDPacker pack(final byte[] o) throws IOException {
        if (o == null) {
            return packNil();
        }
        packRaw(o.length);
        return packRawBody(o);
    }

    public TDPacker pack(final ByteBuffer o) throws IOException {
        if (o == null) {
            return packNil();
        }
        packRaw(o.remaining());
        return packRawBody(o.array(), o.arrayOffset() + o.position(),
                o.remaining());
    }

    public TDPacker pack(final double o) throws IOException {
        return packDouble(o);
    }

    public TDPacker pack(final Double o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packDouble(o);
    }

    public TDPacker pack(final float o) throws IOException {
        return packFloat(o);
    }

    public TDPacker pack(final Float o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packFloat(o);
    }

    public TDPacker pack(final int o) throws IOException {
        return packInt(o);
    }

    public TDPacker pack(final Integer o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packInt(o);
    }

    public TDPacker pack(final List<String> o) throws IOException {
        if (o == null) {
            return packNil();
        }
        packArray(o.size());
        for (final String i : o) {
            pack(i);
        }
        return this;
    }

    public TDPacker pack(final long o) throws IOException {
        return packLong(o);
    }

    public TDPacker pack(final Long o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packLong(o);
    }

    public TDPacker pack(final Map<String, Object> o) throws IOException {
        if (o == null) {
            return packNil();
        }
        Map<String, Object> map = new HashMap<String, Object>(16);
        Iterator<String> it = o.keySet().iterator();
        while(it.hasNext()){
            String key = it.next();
            Object value = o.get(key);
            if(value instanceof String){
                map.put(key, value.toString());
            }else if(value instanceof Number){
                map.put(key, ((Number) value).doubleValue());
            }
        }

        packMap(map.size());
        for (final Map.Entry<String, Object> e : (map).entrySet()) {
            pack(e.getKey());
            Object value = e.getValue();
            if (value instanceof Number) {
                pack(((Number) value).doubleValue());
            } else if(value instanceof String){
                pack(value.toString());
            }
        }
        return this;
    }

    public TDPacker pack(final TDMessagePackable o) throws IOException {
        if (o == null) {
            return packNil();
        }
        o.messagePack(this);
        return this;
    }

    public TDPacker pack(final short o) throws IOException {
        return packShort(o);
    }

    public TDPacker pack(final Short o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packShort(o);
    }

    public TDPacker pack(final String o) throws IOException {
        if (o == null) {
            return packNil();
        }
        return packString(o);
    }

    public TDPacker packArray(final int n) throws IOException {
        if (n < 16) {
            final int d = 0x90 | n;
            out.write((byte) d);
        } else if (n < 65536) {
            castBytes[0] = (byte) 0xdc;
            castBytes[1] = (byte) (n >> 8);
            castBytes[2] = (byte) (n >> 0);
            out.write(castBytes, 0, 3);
        } else {
            castBytes[0] = (byte) 0xdd;
            castBytes[1] = (byte) (n >> 24);
            castBytes[2] = (byte) (n >> 16);
            castBytes[3] = (byte) (n >> 8);
            castBytes[4] = (byte) (n >> 0);
            out.write(castBytes, 0, 5);
        }
        return this;
    }

    public TDPacker packBigInteger(final BigInteger d) throws IOException {
        if (d.bitLength() <= 63) {
            return packLong(d.longValue());
        } else if ((d.bitLength() <= 64) && (d.signum() >= 0)) {
            castBytes[0] = (byte) 0xcf;
            final byte[] barray = d.toByteArray();
            castBytes[1] = barray[barray.length - 8];
            castBytes[2] = barray[barray.length - 7];
            castBytes[3] = barray[barray.length - 6];
            castBytes[4] = barray[barray.length - 5];
            castBytes[5] = barray[barray.length - 4];
            castBytes[6] = barray[barray.length - 3];
            castBytes[7] = barray[barray.length - 2];
            castBytes[8] = barray[barray.length - 1];
            out.write(castBytes, 0, 9);
            return this;
        } else {
            throw new IOException(
                    "can't pack BigInteger larger than 0xffffffffffffffff");
        }
    }

    public TDPacker packBoolean(final boolean d) throws IOException {
        return d ? packTrue() : packFalse();
    }

    public TDPacker packByte(final byte d) throws IOException {
        if (d < -(1 << 5)) {
            castBytes[0] = (byte) 0xd0;
            castBytes[1] = d;
            out.write(castBytes, 0, 2);
        } else {
            out.write(d);
        }
        return this;
    }

    public TDPacker packByteArray(final byte[] b) throws IOException {
        packRaw(b.length);
        return packRawBody(b, 0, b.length);
    }

    public TDPacker packByteArray(final byte[] b, final int off,
                                  final int length) throws IOException {
        packRaw(length);
        return packRawBody(b, off, length);
    }

    public TDPacker packByteBuffer(final ByteBuffer buf) throws IOException {
        packRaw(buf.remaining());
        return packRawBody(buf.array(), buf.arrayOffset() + buf.position(),
                buf.remaining());
    }

    public TDPacker packDouble(final double d) throws IOException {
        castBytes[0] = (byte) 0xcb;
        final long f = Double.doubleToRawLongBits(d);
        castBytes[1] = (byte) (f >> 56);
        castBytes[2] = (byte) (f >> 48);
        castBytes[3] = (byte) (f >> 40);
        castBytes[4] = (byte) (f >> 32);
        castBytes[5] = (byte) (f >> 24);
        castBytes[6] = (byte) (f >> 16);
        castBytes[7] = (byte) (f >> 8);
        castBytes[8] = (byte) (f >> 0);
        out.write(castBytes, 0, 9);
        return this;
    }

    public TDPacker packFalse() throws IOException {
        out.write((byte) 0xc2);
        return this;
    }

    public TDPacker packFloat(final float d) throws IOException {
        castBytes[0] = (byte) 0xca;
        final int f = Float.floatToRawIntBits(d);
        castBytes[1] = (byte) (f >> 24);
        castBytes[2] = (byte) (f >> 16);
        castBytes[3] = (byte) (f >> 8);
        castBytes[4] = (byte) (f >> 0);
        out.write(castBytes, 0, 5);
        return this;
    }

    public TDPacker packInt(final int d) throws IOException {
        if (d < -(1 << 5)) {
            if (d < -(1 << 15)) {
                // signed 32
                castBytes[0] = (byte) 0xd2;
                castBytes[1] = (byte) (d >> 24);
                castBytes[2] = (byte) (d >> 16);
                castBytes[3] = (byte) (d >> 8);
                castBytes[4] = (byte) (d >> 0);
                out.write(castBytes, 0, 5);
            } else if (d < -(1 << 7)) {
                // signed 16
                castBytes[0] = (byte) 0xd1;
                castBytes[1] = (byte) (d >> 8);
                castBytes[2] = (byte) (d >> 0);
                out.write(castBytes, 0, 3);
            } else {
                // signed 8
                castBytes[0] = (byte) 0xd0;
                castBytes[1] = (byte) d;
                out.write(castBytes, 0, 2);
            }
        } else if (d < (1 << 7)) {
            // fixnum
            out.write((byte) d);
        } else {
            if (d < (1 << 8)) {
                // unsigned 8
                castBytes[0] = (byte) 0xcc;
                castBytes[1] = (byte) d;
                out.write(castBytes, 0, 2);
            } else if (d < (1 << 16)) {
                // unsigned 16
                castBytes[0] = (byte) 0xcd;
                castBytes[1] = (byte) (d >> 8);
                castBytes[2] = (byte) (d >> 0);
                out.write(castBytes, 0, 3);
            } else {
                // unsigned 32
                castBytes[0] = (byte) 0xce;
                castBytes[1] = (byte) (d >> 24);
                castBytes[2] = (byte) (d >> 16);
                castBytes[3] = (byte) (d >> 8);
                castBytes[4] = (byte) (d >> 0);
                out.write(castBytes, 0, 5);
            }
        }
        return this;
    }

    public TDPacker packLong(final long d) throws IOException {
        if (d < -(1L << 5)) {
            if (d < -(1L << 15)) {
                if (d < -(1L << 31)) {
                    // signed 64
                    castBytes[0] = (byte) 0xd3;
                    castBytes[1] = (byte) (d >> 56);
                    castBytes[2] = (byte) (d >> 48);
                    castBytes[3] = (byte) (d >> 40);
                    castBytes[4] = (byte) (d >> 32);
                    castBytes[5] = (byte) (d >> 24);
                    castBytes[6] = (byte) (d >> 16);
                    castBytes[7] = (byte) (d >> 8);
                    castBytes[8] = (byte) (d >> 0);
                    out.write(castBytes, 0, 9);
                } else {
                    // signed 32
                    castBytes[0] = (byte) 0xd2;
                    castBytes[1] = (byte) (d >> 24);
                    castBytes[2] = (byte) (d >> 16);
                    castBytes[3] = (byte) (d >> 8);
                    castBytes[4] = (byte) (d >> 0);
                    out.write(castBytes, 0, 5);
                }
            } else {
                if (d < -(1 << 7)) {
                    // signed 16
                    castBytes[0] = (byte) 0xd1;
                    castBytes[1] = (byte) (d >> 8);
                    castBytes[2] = (byte) (d >> 0);
                    out.write(castBytes, 0, 3);
                } else {
                    // signed 8
                    castBytes[0] = (byte) 0xd0;
                    castBytes[1] = (byte) d;
                    out.write(castBytes, 0, 2);
                }
            }
        } else if (d < (1 << 7)) {
            // fixnum
            out.write((byte) d);
        } else {
            if (d < (1L << 16)) {
                if (d < (1 << 8)) {
                    // unsigned 8
                    castBytes[0] = (byte) 0xcc;
                    castBytes[1] = (byte) d;
                    out.write(castBytes, 0, 2);
                } else {
                    // unsigned 16
                    castBytes[0] = (byte) 0xcd;
                    castBytes[1] = (byte) ((d & 0x0000ff00) >> 8);
                    castBytes[2] = (byte) ((d & 0x000000ff) >> 0);
                    out.write(castBytes, 0, 3);
                }
            } else {
                if (d < (1L << 32)) {
                    // unsigned 32
                    castBytes[0] = (byte) 0xce;
                    castBytes[1] = (byte) ((d & 0xff000000) >> 24);
                    castBytes[2] = (byte) ((d & 0x00ff0000) >> 16);
                    castBytes[3] = (byte) ((d & 0x0000ff00) >> 8);
                    castBytes[4] = (byte) ((d & 0x000000ff) >> 0);
                    out.write(castBytes, 0, 5);
                } else {
                    // unsigned 64
                    castBytes[0] = (byte) 0xcf;
                    castBytes[1] = (byte) (d >> 56);
                    castBytes[2] = (byte) (d >> 48);
                    castBytes[3] = (byte) (d >> 40);
                    castBytes[4] = (byte) (d >> 32);
                    castBytes[5] = (byte) (d >> 24);
                    castBytes[6] = (byte) (d >> 16);
                    castBytes[7] = (byte) (d >> 8);
                    castBytes[8] = (byte) (d >> 0);
                    out.write(castBytes, 0, 9);
                }
            }
        }
        return this;
    }

    public TDPacker packMap(final int n) throws IOException {
        if (n < 16) {
            final int d = 0x80 | n;
            out.write((byte) d);
        } else if (n < 65536) {
            castBytes[0] = (byte) 0xde;
            castBytes[1] = (byte) (n >> 8);
            castBytes[2] = (byte) (n >> 0);
            out.write(castBytes, 0, 3);
        } else {
            castBytes[0] = (byte) 0xdf;
            castBytes[1] = (byte) (n >> 24);
            castBytes[2] = (byte) (n >> 16);
            castBytes[3] = (byte) (n >> 8);
            castBytes[4] = (byte) (n >> 0);
            out.write(castBytes, 0, 5);
        }
        return this;
    }

    public TDPacker packNil() throws IOException {
        out.write((byte) 0xc0);
        return this;
    }

    public TDPacker packRaw(final int n) throws IOException {
        if (n < 32) {
            final int d = 0xa0 | n;
            out.write((byte) d);
        } else if (n < 65536) {
            castBytes[0] = (byte) 0xda;
            castBytes[1] = (byte) (n >> 8);
            castBytes[2] = (byte) (n >> 0);
            out.write(castBytes, 0, 3);
        } else {
            castBytes[0] = (byte) 0xdb;
            castBytes[1] = (byte) (n >> 24);
            castBytes[2] = (byte) (n >> 16);
            castBytes[3] = (byte) (n >> 8);
            castBytes[4] = (byte) (n >> 0);
            out.write(castBytes, 0, 5);
        }
        return this;
    }

    public TDPacker packRawBody(final byte[] b) throws IOException {
        out.write(b);
        return this;
    }

    public TDPacker packRawBody(final byte[] b, final int off, final int length)
            throws IOException {
        out.write(b, off, length);
        return this;
    }

    public TDPacker packShort(final short d) throws IOException {
        if (d < -(1 << 5)) {
            if (d < -(1 << 7)) {
                // signed 16
                castBytes[0] = (byte) 0xd1;
                castBytes[1] = (byte) (d >> 8);
                castBytes[2] = (byte) (d >> 0);
                out.write(castBytes, 0, 3);
            } else {
                // signed 8
                castBytes[0] = (byte) 0xd0;
                castBytes[1] = (byte) d;
                out.write(castBytes, 0, 2);
            }
        } else if (d < (1 << 7)) {
            // fixnum
            out.write((byte) d);
        } else {
            if (d < (1 << 8)) {
                // unsigned 8
                castBytes[0] = (byte) 0xcc;
                castBytes[1] = (byte) d;
                out.write(castBytes, 0, 2);
            } else {
                // unsigned 16
                castBytes[0] = (byte) 0xcd;
                castBytes[1] = (byte) (d >> 8);
                castBytes[2] = (byte) (d >> 0);
                out.write(castBytes, 0, 3);
            }
        }
        return this;
    }

    public TDPacker packString(final String s) throws IOException {
        final byte[] b = (s).getBytes("UTF-8");
        packRaw(b.length);
        return packRawBody(b);
    }

    public TDPacker packTrue() throws IOException {
        out.write((byte) 0xc3);
        return this;
    }

}
