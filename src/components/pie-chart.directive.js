(function() {

  /**
  * Pie chart directive module
  */
  angular
    .module('pie-chart.directive')
    .directive('pieChart', [
      'd3',
      PieChart
    ])
  ;

  /**
   * [PieChart description]
   * @param {[type]} d3 [description]
   */
  function PieChart(d3) {
    return {
      scope: {
        data: '='
      },
      restrict: 'E',
      template: '<div id="chart"></div>',
      link: function($scope, iElm, iAttrs, controller) {
        var width = 900,
            height = 360,
            innerRadius = 75,
            outerRadius = Math.min(width, height) / 2,
            color = d3.scale.category20c(),
            legendThumbSize = 18,
            legendHeightSpacing = 4,
            legendWidthSpacing = 175,
            legendMaxColumn = 10
        ;

        $scope.$watch('data', onData);

        /**
         * On data handler
         * @param  {array} newData
         * @return {void}
         */
        function onData(newData) {
          var tmp = [];

          $scope.data = newData;

          $scope.data
            .sort(function(a, b) {
              return b.count - a.count;
            })
            .forEach(function(data) {
              tmp.push(data.language);
            })
          ;
          color.domain(tmp);

          updatePath();
          updateLegend();
          addTooltip();
        }

        var svg = d3
          .select('#chart')
          .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
              .attr('transform', 'translate(' + (height / 2) + ',' + (height / 2) + ')')
        ;

        var arc = d3.svg.arc()
          .innerRadius(outerRadius - innerRadius)
          .outerRadius(outerRadius)
        ;

        var pie = d3.layout.pie()
          .value(function(d) { return d.count; })
          .sort(null)
        ;

        var path = svg.selectAll('path');

        /**
         * Update path method
         */
        function updatePath() {

          path = path
            .data(pie($scope.data))
          ;

          path
            .enter()
            .append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) {
                return color(d.data.language);
              })
              .each(function(d) {
                this.currentValue = d;
              })
          ;

          path
            .exit()
            .transition()
            .duration(750)
            .attrTween("d", arcTween)
            .remove()
          ;

          path
            .transition()
            .duration(750)
            .attrTween("d", arcTween)
          ;

        }

        /**
         * Tween method for animate arc
         * @param  {object} d
         * @return {void}
         */
        function arcTween(d) {
          var interpolate = d3.interpolate(this.currentValue, d);
          this.currentValue = interpolate(0);
          return function(t) {
            return arc(interpolate(t));
          };
        }

        /**
         * Legend
         */

        var legend = svg.selectAll('.legend');

        /**
         * Update legend method
         */
        function updateLegend() {

          legend = legend
            .data(color.domain())
          ;

          var wrapper = legend
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var currentHeight = legendThumbSize + legendHeightSpacing,
                  offset = currentHeight * legendMaxColumn / 2,
                  x = ((height / 2) + (height / 6)) + (legendWidthSpacing * Math.floor(i / legendMaxColumn)),
                  y = (i - (Math.floor(i / legendMaxColumn) * legendMaxColumn))  * currentHeight - offset
              ;

              return 'translate(' + x + ',' + y + ')';
            })
          ;

          wrapper
            .append('rect')
            .attr('width', legendThumbSize)
            .attr('height', legendThumbSize)
            .style('fill', color)
            .style('stroke', color)
          ;

          wrapper
            .append('text')
            .attr('x', legendThumbSize + legendHeightSpacing)
            .attr('y', legendThumbSize - legendHeightSpacing)
            .text(function(d) { return d; })
          ;

          legend
            .exit()
            .remove()
          ;

          legend
            .select('rect')
            .style('fill', color)
            .style('stroke', color)
          ;

          legend
            .select('text')
            .text(function(d) { return d; })
          ;

        }

        /**
         * Tooltip
         */

        var tooltip = d3
          .select('#chart')
          .append('div')
            .attr('class', 'info-pie')
        ;

        tooltip
          .append('div')
            .attr('class', 'pie-label')
        ;

        tooltip
          .append('div')
            .attr('class', 'stats')
            .append('span')
              .attr('class', 'pie-percent')
        ;

        tooltip
          .select('.stats')
            .append('span')
            .attr('class', 'pie-count')
        ;

        /**
         * Add event for tooltip
         */
        function addTooltip() {
          path.on('mouseover', function(d) {
            var el = this,
                elChart = document.getElementById('chart')
            ;

            var total = d3.sum($scope.data.map(function(d) { return d.count; }));
            tooltip.select('.pie-label').html(d.data.language);
            tooltip.select('.pie-percent').html(Math.round(((100 * d.data.count) / total)) + '%');
            tooltip.select('.pie-count').html('(' + d.data.count + ')');

            tooltip
              .style('display', 'block')
              .style('left', ((el.getBoundingClientRect().left - elChart.getBoundingClientRect().left) + (el.getBoundingClientRect().width / 2)) - (document.querySelector('.info-pie').getBoundingClientRect().width / 2) + 'px')
              .style('top', ((el.getBoundingClientRect().top - elChart.getBoundingClientRect().top) + (el.getBoundingClientRect().height / 2)) - (document.querySelector('.info-pie').getBoundingClientRect().height / 2) + 'px')
            ;

          });

          path.on('mouseout', function() {
            tooltip
              .style('display', 'none')
            ;
          });
        }

      }
    };
  }

}());