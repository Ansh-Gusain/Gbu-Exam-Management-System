import { useState, useMemo } from "react";
import { useStore } from "../lib/store";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "./ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Search, Plus, Pencil, Trash2, DoorOpen, Monitor } from "lucide-react";

export function RoomManagement() {
  const { rooms, setRooms } = useStore();
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    building: "Main Block",
    floor: 0,
    capacity: 30,
    hasProjector: false,
    isAvailable: true,
  });

  const buildings = useMemo(
    () => [...new Set(rooms.map((r) => r.building))],
    [rooms]
  );

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch = r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.building.toLowerCase().includes(search.toLowerCase());
      const matchBuilding = buildingFilter === "all" || r.building === buildingFilter;
      return matchSearch && matchBuilding;
    });
  }, [rooms, search, buildingFilter]);

  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const availableRooms = rooms.filter((r) => r.isAvailable).length;

  const openAdd = () => {
    setEditingRoom(null);
    setFormData({ roomNumber: "", building: "Main Block", floor: 0, capacity: 30, hasProjector: false, isAvailable: true });
    setDialogOpen(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      hasProjector: room.hasProjector,
      isAvailable: room.isAvailable,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.roomNumber) return;
    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id ? { ...r, ...formData } : r
        )
      );
    } else {
      const newRoom = {
        id: `r-${Date.now()}`,
        ...formData,
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleAvailability = (id) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isAvailable: !r.isAvailable } : r))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>Room Management</h1>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Room
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-[0.85rem]"
              />
            </div>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-[180px] h-9 text-[0.85rem]">
                <SelectValue placeholder="Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((room) => (
          <Card key={room.id} className={`relative ${!room.isAvailable ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[0.9rem]">Room {room.roomNumber}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(room)} className="p-1 rounded hover:bg-accent">
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="p-1 rounded hover:bg-accent">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-[0.8rem]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Building</span>
                  <span>{room.building}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Floor</span>
                  <span>{room.floor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-mono">{room.capacity}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {room.hasProjector && (
                    <Badge variant="secondary" className="text-[0.65rem] py-0">
                      <Monitor className="w-3 h-3 mr-1" /> Projector
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[0.7rem] text-muted-foreground">
                    {room.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  <Switch
                    checked={room.isAvailable}
                    onCheckedChange={() => toggleAvailability(room.id)}
                    className="scale-75"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>
              {editingRoom ? "Make changes to the room details." : "Enter the room details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[0.8rem]">Room Number</Label>
                <Input
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="text-[0.85rem]"
                />
              </div>
              <div>
                <Label className="text-[0.8rem]">Floor</Label>
                <Input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                  className="text-[0.85rem]"
                />
              </div>
            </div>
            <div>
              <Label className="text-[0.8rem]">Building</Label>
              <Input
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="text-[0.85rem]"
              />
            </div>
            <div>
              <Label className="text-[0.8rem]">Capacity</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="text-[0.85rem]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.hasProjector}
                onCheckedChange={(c) => setFormData({ ...formData, hasProjector: c })}
              />
              <Label className="text-[0.8rem]">Has Projector</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(c) => setFormData({ ...formData, isAvailable: c })}
              />
              <Label className="text-[0.8rem]">Available for Exams</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingRoom ? "Update" : "Add Room"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
