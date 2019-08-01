import { Component, Input, SimpleChanges, Injector, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageHeatmapService } from '../page-heatmap.service';
import { BaseComponent } from '../../../common/base-component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-page-heatmap-iframe',
  templateUrl: './page-heatmap-iframe.component.html',
  styleUrls: ['./page-heatmap-iframe.component.less']
})
export class PageHeatmapIframeComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() filter: any;
  _heatmapFilter: any;
  _heatmapType = 'tdHeatMap';
  _iframeUrl: SafeResourceUrl;
  _containerStyle = {
    height: ''
  };
  _pageDatas: any = {};
  _currentPage: any;
  _isGetPage: boolean;
  pageSelect: any;
  pixelSelect: any;
  _pagePixelStyle: any = {
    width: 'auto'
  };
  _isH5Page: boolean;
  _topElems: any[];
  _loadingText: string;
  queryParam: any;
  urlParams: any;

  constructor(private domSanitizer: DomSanitizer, private service: PageHeatmapService, private injector: Injector) {
    super(injector);
    this.urlParams = {};
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  calContainerStyle(): void {
    setTimeout(() => {
      const header = document.getElementById('heat-map-header');
      const tdHeatMapTitle = document.getElementById('td-heat-map-title');
      let headerHg = 0;
      let tdHeatMapTitleHg = 0;
      if (header) {
        headerHg = header.offsetHeight;
      }
      if (tdHeatMapTitle) {
        tdHeatMapTitleHg = tdHeatMapTitle.offsetHeight;
      }
      this._containerStyle = {
        height: window.innerHeight - headerHg - tdHeatMapTitleHg - 170 + 'px'
      };
    }, 200);
  }

  changeHeatmapType(value: any) {
    this.queryHeatMapData();
  }

  onSelectPage(page: any) {
    this._isGetPage = true;
    if (page && page.value) {
      this._currentPage = page;
      this.queryHeatMapData();
    }
  }

  queryHeatMapData() {
    const param = this._heatmapFilter || {};
    param.productid = this.productId;
    param.type = this._heatmapType;
    if (param.sourceid === 2) {
      this._isH5Page = true;
    }
    if (!this._currentPage || !this._currentPage.value) {
      return false;
    }
    param.pageid = this._currentPage.value;
    this._loadingText = '加载中...';
    this.queryParam = param;

    this.service.queryHeatmapData(param).subscribe((response: any) => {
      if (response) {
        this._pageDatas = response;
        this._topElems = this._pageDatas.topElems;
        if (this._pageDatas.pageName) {
          this._buildUrl();
          setTimeout(() => {
            this.rendHeatMap();
          }, 100);
        }
      }
    });
  }

  rendHeatMap() {
    const _this2 = this;
    const _iframeUrl = this._iframeUrl.toString();
    const checkIframe = setInterval(() => {
      const tdHeatMapIframe = document.getElementById('tdHeatMapIframe');
      if (!tdHeatMapIframe) {
        _this2.rendHeatMap();
      } else {
        clearInterval(checkIframe);
        _this2.postMsgToChildIframe();
        if (!/*@cc_on!@*/ 0) {
          tdHeatMapIframe.onload = function() {
            _this2.postMsgToChildIframe();
          };
        } else {
          tdHeatMapIframe['onreadystatechange'] = function() {
            if (tdHeatMapIframe['readyState'] === 'complete') {
              _this2.postMsgToChildIframe();
            }
          };
        }

        window.addEventListener('message', function(rs) {
          if (_iframeUrl && rs.origin && _iframeUrl.indexOf(rs.origin) !== -1) {
            if (rs.data === 'iframeDomHasLoaded') {
              _this2.postMsgToChildIframe();
            }
          }
        });
      }
    }, 100);
  }

  postMsgToChildIframe() {
    const tdHeatMapIframe = document.getElementById('tdHeatMapIframe');
    const data = {
      tdPageFlag: this._heatmapType,
      data: this._pageDatas
    };
    tdHeatMapIframe['contentWindow'].postMessage(JSON.stringify(data), '*');
  }

  listenerWindownResize() {
    this.calContainerStyle();
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(event => {
        this.calContainerStyle();
      });
  }

  changeUrlParam(url, name, value) {
    let newUrl = '';
    const reg = new RegExp(`(^|)${name}=([^&]*)(|$)`).toString();
    const tmp = `${name}=${value}`;
    if (url.match(reg) != null) {
      //            newUrl = url.replace(eval(reg), tmp);
    } else {
      if (url.match('[?]')) {
        newUrl = `${url}&${tmp}`;
      } else {
        newUrl = `${url}?${tmp}`;
      }
    }
    return newUrl;
  }

  _buildUrl() {
    let url = this._pageDatas.pageName;
    url = this.changeUrlParam(url, 'tdTimecc', Math.random());
    this._iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  selectsearchPixel(value: any) {
    this._pagePixelStyle = {
      width: value
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filter) {
      this._heatmapFilter = changes.filter.currentValue;
      if (this._heatmapFilter) {
        //        this._heatmapType = 'tdHeatMap';
        if (!this.pageSelect) {
          this.pageSelect = {
            apiUrl: this.service.queryPageUrl,
            apiParam: {
              productid: this.productId,
              sourceid: this._heatmapFilter.sourceid,
              page: 1,
              rows: 20
            },
            keywordFiled: 'displayname'
          };
        } else {
          this.queryHeatMapData();
        }
      }
    }
  }

  ngOnInit() {
    this.pixelSelect = {
      size: 'small',
      apiData: false,
      initValue: 'auto',
      selectOptions: [
        {
          value: 'auto',
          label: '页面宽度-全部像素'
        },
        {
          value: '320px',
          label: '页面宽度-320px'
        },
        {
          value: '360px',
          label: '页面宽度-360px'
        },
        {
          value: '375px',
          label: '页面宽度-375px'
        },
        {
          value: '412px',
          label: '页面宽度-412px'
        },
        {
          value: '414px',
          label: '页面宽度-414px'
        },
        {
          value: '640px',
          label: '页面宽度-640px'
        },
        {
          value: '720px',
          label: '页面宽度-720px'
        },
        {
          value: '750px',
          label: '页面宽度-750px'
        },
        {
          value: '768px',
          label: '页面宽度-768px'
        },
        {
          value: '824px',
          label: '页面宽度-824px'
        },
        {
          value: '828px',
          label: '页面宽度-828px'
        },
        {
          value: '1024px',
          label: '页面宽度-1024px'
        }
      ]
    };
    this.listenerWindownResize();
  }
}
