/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAngularEvent } from 'angular';
import { ISortingValues } from '../core';
import { IColumnDef } from './public-interfaces';
import { ITableScope } from './ngTableController';

/**
 * @private
 */
export interface IScopeExtensions {
    sortLive:any;	
    sortBy($column: IColumnDef, event: IAugmentedMouseEvent): void;
	resetSortLive() : void;
}

/**
 * @private
 */
export interface IAugmentedMouseEvent extends IAngularEvent {
    ctrlKey: boolean;
    metaKey: boolean;
}

ngTableSorterRowController.$inject = ['$scope'];

/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
export function ngTableSorterRowController<T>($scope: ITableScope<T> & IScopeExtensions) {

    $scope.sortBy = sortBy;
    $scope.resetSortLive = resetSortLive;
    
    ///////////

    function sortBy($column: IColumnDef, event: IAugmentedMouseEvent) {
        $scope.resetSortLive;
        var parsedSortable = $column.sortable && $column.sortable();        
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        } else {
            var defaultSort = $scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams: ISortingValues = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            $scope.params.parameters({
                sorting: sortingParams
            });
            
            $scope.$columns.forEach(function(col){
                if(col.id == $column.id){                    
                    var newDesc = '';
                    if((sorting ? inverseSort : defaultSort) === 'asc'){
                        newDesc = $scope.params.accessibilityOptions('sortDescriptionAsc');
                    }
                    else{
                        newDesc = $scope.params.accessibilityOptions('sortDescriptionDesc');
                    }
                    (<any>col.sortDescription).assign($scope, newDesc);
                }                
            });

            $scope.sortLive = JSON.parse(JSON.stringify(sortingParams));
            $scope.sortLive[parsedSortable] = $scope.params.accessibilityOptions('sortedLive');			
        }

    }

    function resetSortLive() {
		$scope.sortLive = {};
	}
}