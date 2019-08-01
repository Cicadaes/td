/*
 * Copyright (C) 2003-2015 eXo Platform SAS.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package td.enterprise.wanalytics.processor.cache;

import net.sf.ehcache.CacheEntry;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.writer.CacheWriter;
import net.sf.ehcache.writer.writebehind.operations.SingleOperationType;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.utils.RedisClient;

import java.util.Collection;

/**
 * Created by The eXo Platform SAS
 * Author : eXoPlatform
 * exo@exoplatform.com
 * May 12, 2015
 */
public class AllMacCacheWriter implements CacheWriter {
    private static final Logger log = Logger.getLogger(AllMacCacheWriter.class);
    private final Ehcache cache;

    public AllMacCacheWriter(Ehcache cache) {
        this.cache = cache;
    }

    @Override
    public CacheWriter clone(Ehcache arg0) throws CloneNotSupportedException {
        return null;
    }

    @Override
    public void delete(CacheEntry arg0) throws CacheException {

    }

    @Override
    public void deleteAll(Collection <CacheEntry> arg0) throws CacheException {

    }

    @Override
    public void dispose() throws CacheException {

    }

    @Override
    public void init() {
        log.info("==========AllMacCacheWriter#init==========");
    }

    @Override
    public void throwAway(Element arg0, SingleOperationType arg1, RuntimeException arg2) {

    }

    @Override
    public void write(Element element) throws CacheException {
        // log.info("==========AllMacCacheWriter#write(Element)==========");
        // if (element.getKey().toString().indexOf(RedisClient.ALL_SENSOR_PREFIX) != -1) {
        // 	RedisClient.putSadd(element.getKey() + "", (Set) element.getValue(), RedisClient.allMacSetTimeoutSeconds, RedisClient.ALL_MAC_DB_INDEX);
        // 	Set <String> set = new HashSet <>();
        // 	set.add(element.getKey() + "");
        // 	RedisClient.putSadd(RedisClient.ALL_SENSOR_KEY, set, RedisClient.allMacSetTimeoutSeconds, RedisClient.ALL_MAC_DB_INDEX);
        // }
        // log.info("==========AllMacCacheWriter#write(Element):: put to cache==========");
        // log.info("cache size = " + cache.getSize());
    }

    @Override
    public void writeAll(Collection <Element> list) throws CacheException {
        log.info("==========AllMacCacheWriter#writeAll(list)==========" + list.size());
        RedisClient.putSaddPipeline(list, RedisClient.allMacSetTimeoutSeconds, Constants.ALL_MAC_DB_INDEX);
    }

}
