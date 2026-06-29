import { useQuery } from '@tanstack/react-query';
import { Route } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Input } from '@/components/ui/input';
import { 
  Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  Users, 
  Wrench, 
  Plus, 
  Edit3, 
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export default function RouteBuilder() {
  const { data, isLoading, error, refetch } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: () => api.get('/routes/').then(r => r.data),
  });

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <div className="p-6 text-red-600">
      <AlertCircle className="inline mr-2" />
      Failed to load routes
    </div>
  );
  if (!data) return <div className="p-6">No routes found</div>;

  const handleOptimize = async (routeId: number) => {
    setIsOptimizing(true);
    try {
      await api.post(`/routes/${routeId}/optimize`);
      await refetch();
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCreateRoute = async () => {
    if (!newRouteName.trim()) return;
    
    try {
      await api.post('/routes/', { name: newRouteName });
      setShowCreateDialog(false);
      setNewRouteName('');
      await refetch();
    } catch (err) {
      console.error('Failed to create route:', err);
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Route Builder</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Route
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Route</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="route-name">Route Name</Label>
                <Input
                  id="route-name"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  placeholder="Enter route name"
                />
              </div>
              <Button onClick={handleCreateRoute}>Create Route</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Routes</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((route: any) => (
              <Card key={route.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedRoute(route)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOptimize(route.id)}
                        disabled={isOptimizing}
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {route.scheduled_date || 'No date'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {route.driver_id ? `Driver ${route.driver_id}` : 'No driver assigned'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {route.total_distance_miles ? `${route.total_distance_miles} miles` : 'No distance'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                      {getStatusBadge(route.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .filter((route: any) => route.status === 'in_progress' || route.status === 'scheduled')
                .map((route: any) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{getStatusBadge(route.status)}</TableCell>
                    <TableCell>{route.driver_id ? `Driver ${route.driver_id}` : '-'}</TableCell>
                    <TableCell>{route.scheduled_date || '-'}</TableCell>
                    <TableCell>{route.total_distance_miles ? `${route.total_distance_miles} miles` : '-'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOptimize(route.id)}
                        disabled={isOptimizing}
                      >
                        Optimize
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .filter((route: any) => route.status === 'completed')
                .map((route: any) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{getStatusBadge(route.status)}</TableCell>
                    <TableCell>{route.driver_id ? `Driver ${route.driver_id}` : '-'}</TableCell>
                    <TableCell>{route.completed_at || '-'}</TableCell>
                    <TableCell>{route.total_distance_miles ? `${route.total_distance_miles} miles` : '-'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-route-name">Route Name</Label>
                <Input
                  id="edit-route-name"
                  value={selectedRoute.name}
                  onChange={(e) => setSelectedRoute({...selectedRoute, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-route-status">Status</Label>
                <Select 
                  value={selectedRoute.status || ''}
                  onValueChange={(value) => setSelectedRoute({...selectedRoute, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRoute(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    if (selectedRoute) {
                      await api.put(`/routes/${selectedRoute.id}`, selectedRoute);
                      await refetch();
                      setSelectedRoute(null);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}