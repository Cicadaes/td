/**
 * 
 * @author davy
 * 日期:		2013-8-14 11:32:29
 * 
 * The default character set is UTF-8.
 */
package td.enterprise.framework.commons;

/**
 * The Class KeyValue. The default character set is UTF-8
 * <p>
 * 中文：<br>
 * 这个类你可以看作和Map类中的一个元素是一样的。<br>
 * English:<br>
 * This class can be viewed and Map your class is the same as an element.
 * </p>
 * 
 * @param <K>
 *            the key type
 * @param <V>
 *            the value type
 * @author davy
 */
public class KeyValue<K, V> implements java.util.Map.Entry<K, V> {

	/** The key. */
	private K key;

	/** The value. */
	private V value;

	/**
	 * Instantiates a new key value.
	 */
	public KeyValue() {
	}

	/**
	 * Instantiates a new key value.
	 * 
	 * @param key
	 *            the key
	 * @param value
	 *            the value
	 */
	public KeyValue(K key, V value) {
		this.key = key;
		this.value = value;
	}

	/**
	 * Gets the key.
	 * 
	 * @return the key
	 */
	public K getKey() {
		return key;
	}

	/**
	 * Gets the value.
	 * 
	 * @return the value
	 */
	public V getValue() {
		return value;
	}

	/**
	 * Sets the key.
	 * 
	 * @param key
	 *            the new key
	 */
	public void setKey(K key) {
		this.key = key;
	}

	/**
	 * Sets the value.
	 * 
	 * @param value
	 *            the new value
	 */
	public V setValue(V value) {
		this.value = value;
		return value;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "KeyValue [key=" + key + ", value=" + value + "]";
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((key == null) ? 0 : key.hashCode());
		result = prime * result + ((value == null) ? 0 : value.hashCode());
		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		KeyValue other = (KeyValue) obj;
		if (key == null) {
			if (other.key != null)
				return false;
		} else if (!key.equals(other.key))
			return false;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}

}
