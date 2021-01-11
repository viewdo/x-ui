import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dxp-form-scene',
  styleUrl: 'dxp-form-scene.css',
  shadow: false,
})
export class DxpForm {
  render() {
    return (
      <Host>
        <form>
          <div class="form-group">
              <label>Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1" />
            <label class="form-check-label">Check me out</label>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>

          <div class="form-group">
            <label>Example select</label>
            <select class="form-control" id="exampleFormControlSelect1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div class="form-group">
            <label>Example multiple select</label>
            <select multiple class="form-control" id="exampleFormControlSelect2">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div class="form-group">
            <label>Example textarea</label>
            <textarea class="form-control" id="exampleFormControlTextarea1"></textarea>
          </div>
        </form>
      </Host>
    );
  }
}
